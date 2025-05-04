
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Создаем экземпляр axios с базовым URL
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Тип для хранения токенов
interface TokensData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp когда истекает access token
}

// Функции для работы с токенами в localStorage
const TokenService = {
  getTokens: (): TokensData | null => {
    const tokensStr = localStorage.getItem('tokens');
    if (!tokensStr) return null;
    try {
      return JSON.parse(tokensStr) as TokensData;
    } catch {
      return null;
    }
  },
  
  saveTokens: (tokens: TokensData): void => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  },
  
  removeTokens: (): void => {
    localStorage.removeItem('tokens');
  },
  
  isAccessTokenExpired: (): boolean => {
    const tokens = TokenService.getTokens();
    if (!tokens) return true;
    // Проверяем, истек ли токен (с запасом в 10 секунд)
    return Date.now() >= tokens.expiresAt - 10000;
  }
};

// Переменная для хранения состояния обновления токена
let isRefreshing = false;
// Массив колбэков запросов, ожидающих обновления токена
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для добавления запроса в очередь ожидания токена
const subscribeToTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Функция для исполнения ожидающих запросов после обновления токена
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

// Функция для отклонения всех ожидающих запросов в случае ошибки обновления токена
const onRefreshError = (error: Error) => {
  refreshSubscribers.forEach(callback => callback(''));
  refreshSubscribers = [];
  
  // Очищаем токены и перенаправляем на страницу входа
  TokenService.removeTokens();
  window.location.href = '/login';
};

// Интерцептор запросов: добавляет токен авторизации
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Если это запрос на обновление токена, пропускаем
    if (config.url?.includes('refresh-token')) {
      return config;
    }
    
    // Получаем токены
    const tokens = TokenService.getTokens();
    
    // Если токенов нет или не требуется авторизация для запроса, пропускаем
    if (!tokens || config.headers?.skipAuth) {
      return config;
    }
    
    // Проверяем, истек ли access token
    if (TokenService.isAccessTokenExpired()) {
      // Если процесс обновления токена уже запущен, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise<InternalAxiosRequestConfig>((resolve) => {
          subscribeToTokenRefresh(newToken => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          });
        });
      }
      
      // Запускаем процесс обновления токена
      isRefreshing = true;
      
      try {
        // Запрос на обновление токена
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken: tokens.refreshToken }
        );
        
        const newTokens: TokensData = response.data;
        TokenService.saveTokens(newTokens);
        
        // Уведомляем ожидающие запросы о новом токене
        onTokenRefreshed(newTokens.accessToken);
        
        // Устанавливаем новый токен для текущего запроса
        config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      } catch (error) {
        onRefreshError(error as Error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Устанавливаем актуальный токен
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответов: обрабатывает ошибки и устаревшие токены
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Получаем конфиг запроса и проверяем ответ
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean });
    const status = error.response?.status;
    
    // В случае ошибки 401 (Unauthorized) и это не запрос на обновление токена 
    // и запрос еще не повторялся, пробуем обновить токен
    if (
      status === 401 && 
      originalRequest && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('refresh-token')
    ) {
      // Если процесс обновления токена уже идет, добавляем запрос в очередь
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeToTokenRefresh(newToken => {
            if (newToken) {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              } else {
                originalRequest.headers = { Authorization: `Bearer ${newToken}` };
              }
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const tokens = TokenService.getTokens();
        if (!tokens) {
          throw new Error('No refresh token available');
        }
        
        // Запрос на обновление токена
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken: tokens.refreshToken }
        );
        
        const newTokens: TokensData = response.data;
        TokenService.saveTokens(newTokens);
        
        // Уведомляем ожидающие запросы о новом токене
        onTokenRefreshed(newTokens.accessToken);
        
        // Повторяем исходный запрос с новым токеном
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        } else {
          originalRequest.headers = { Authorization: `Bearer ${newTokens.accessToken}` };
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        onRefreshError(refreshError as Error);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Обработка других ошибок
    if (status === 403) {
      // Доступ запрещен - недостаточно прав
      console.error('Недостаточно прав для выполнения операции');
    } else if (status === 404) {
      // Ресурс не найден
      console.error('Запрашиваемый ресурс не найден');
    } else if (status >= 500) {
      // Ошибка сервера
      console.error('Произошла ошибка на сервере');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
