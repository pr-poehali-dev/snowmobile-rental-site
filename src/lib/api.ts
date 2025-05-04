
import { Snowmobile } from '@/types/snowmobile';
import { User, UserCredentials, UserRegistration } from '@/types/user';

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.snowrent.example.com/api';

// Интерфейс для ответа API
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Интерфейс для параметров запроса
interface RequestParams {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
}

// Интерфейс для опций пагинации
export interface PaginationOptions {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Интерфейс для результатов пагинации
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Получение токена из localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Базовый метод для отправки запросов к API
async function apiRequest<T>({ endpoint, method = 'GET', body, token }: RequestParams): Promise<ApiResponse<T>> {
  const authToken = token || getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Произошла ошибка при выполнении запроса');
    }
    
    return {
      data: data.data || data,
      message: data.message,
      success: true,
    };
  } catch (error) {
    // В реальном приложении здесь можно добавить логирование ошибок
    console.error('API request error:', error);
    throw error;
  }
}

// API для работы со снегоходами
export const snowmobileApi = {
  // Получение списка снегоходов с пагинацией
  async getSnowmobiles(options: PaginationOptions): Promise<PaginatedResult<Snowmobile>> {
    const { page, limit, search, sort, order } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) queryParams.append('search', search);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      return mockSnowmobilesData(options);
    }
    
    const response = await apiRequest<PaginatedResult<Snowmobile>>({
      endpoint: `/snowmobiles?${queryParams.toString()}`,
    });
    
    return response.data;
  },
  
  // Получение снегохода по ID
  async getSnowmobileById(id: number): Promise<Snowmobile> {
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      const mockData = mockSnowmobilesData({ page: 1, limit: 10 });
      const snowmobile = mockData.items.find(item => item.id === id);
      
      if (!snowmobile) {
        throw new Error('Снегоход не найден');
      }
      
      return snowmobile;
    }
    
    const response = await apiRequest<Snowmobile>({
      endpoint: `/snowmobiles/${id}`,
    });
    
    return response.data;
  },
  
  // Создание нового снегохода
  async createSnowmobile(data: Omit<Snowmobile, 'id'>): Promise<Snowmobile> {
    const response = await apiRequest<Snowmobile>({
      endpoint: '/snowmobiles',
      method: 'POST',
      body: data,
    });
    
    return response.data;
  },
  
  // Обновление снегохода
  async updateSnowmobile(id: number, data: Partial<Snowmobile>): Promise<Snowmobile> {
    const response = await apiRequest<Snowmobile>({
      endpoint: `/snowmobiles/${id}`,
      method: 'PUT',
      body: data,
    });
    
    return response.data;
  },
  
  // Удаление снегохода
  async deleteSnowmobile(id: number): Promise<void> {
    await apiRequest<void>({
      endpoint: `/snowmobiles/${id}`,
      method: 'DELETE',
    });
  },
};

// API для работы с бронированиями
export interface Booking {
  id: string;
  userId: string;
  snowmobileId: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreateData {
  snowmobileId: number;
  startDate: string;
  endDate: string;
  quantity: number;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const bookingApi = {
  // Получение списка бронирований с пагинацией
  async getBookings(options: PaginationOptions): Promise<PaginatedResult<Booking>> {
    const { page, limit, search, sort, order } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) queryParams.append('search', search);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      return mockBookingsData(options);
    }
    
    const response = await apiRequest<PaginatedResult<Booking>>({
      endpoint: `/bookings?${queryParams.toString()}`,
    });
    
    return response.data;
  },
  
  // Получение бронирования по ID
  async getBookingById(id: string): Promise<Booking> {
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      const mockData = mockBookingsData({ page: 1, limit: 10 });
      const booking = mockData.items.find(item => item.id === id);
      
      if (!booking) {
        throw new Error('Бронирование не найдено');
      }
      
      return booking;
    }
    
    const response = await apiRequest<Booking>({
      endpoint: `/bookings/${id}`,
    });
    
    return response.data;
  },
  
  // Создание нового бронирования
  async createBooking(data: BookingCreateData): Promise<Booking> {
    const response = await apiRequest<Booking>({
      endpoint: '/bookings',
      method: 'POST',
      body: data,
    });
    
    return response.data;
  },
  
  // Обновление статуса бронирования
  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await apiRequest<Booking>({
      endpoint: `/bookings/${id}/status`,
      method: 'PUT',
      body: { status },
    });
    
    return response.data;
  },
  
  // Отмена бронирования
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const response = await apiRequest<Booking>({
      endpoint: `/bookings/${id}/cancel`,
      method: 'POST',
      body: { reason },
    });
    
    return response.data;
  },
};

// API для работы с пользователями
export const userApi = {
  // Авторизация пользователя
  async login(credentials: UserCredentials): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>({
      endpoint: '/auth/login',
      method: 'POST',
      body: credentials,
    });
    
    return response.data;
  },
  
  // Регистрация пользователя
  async register(data: UserRegistration): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>({
      endpoint: '/auth/register',
      method: 'POST',
      body: data,
    });
    
    return response.data;
  },
  
  // Получение списка пользователей (только для админов)
  async getUsers(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const { page, limit, search, sort, order } = options;
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    if (search) queryParams.append('search', search);
    if (sort) queryParams.append('sort', sort);
    if (order) queryParams.append('order', order);
    
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      return mockUsersData(options);
    }
    
    const response = await apiRequest<PaginatedResult<User>>({
      endpoint: `/users?${queryParams.toString()}`,
    });
    
    return response.data;
  },
  
  // Получение пользователя по ID
  async getUserById(id: string): Promise<User> {
    // В демо-режиме возвращаем мок-данные
    if (import.meta.env.DEV) {
      const mockData = mockUsersData({ page: 1, limit: 10 });
      const user = mockData.items.find(item => item.id === id);
      
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      
      return user;
    }
    
    const response = await apiRequest<User>({
      endpoint: `/users/${id}`,
    });
    
    return response.data;
  },
  
  // Обновление данных пользователя
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiRequest<User>({
      endpoint: `/users/${id}`,
      method: 'PUT',
      body: data,
    });
    
    return response.data;
  },
};

// Моковые данные для разработки
function mockSnowmobilesData(options: PaginationOptions): PaginatedResult<Snowmobile> {
  // Импортируем данные из файла snowmobiles.ts
  const { snowmobiles } = require('@/data/snowmobiles');
  
  const { page, limit, search } = options;
  
  let filteredItems = [...snowmobiles];
  
  // Применяем поиск, если указан
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.brand.toLowerCase().includes(searchLower)
    );
  }
  
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filteredItems.slice(startIndex, endIndex);
  
  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

function mockBookingsData(options: PaginationOptions): PaginatedResult<Booking> {
  const mockBookings: Booking[] = [
    {
      id: 'b1',
      userId: '2',
      snowmobileId: 1,
      startDate: '2025-05-10T00:00:00Z',
      endDate: '2025-05-15T00:00:00Z',
      status: 'confirmed',
      totalAmount: 25000,
      createdAt: '2025-05-01T10:30:00Z',
      updatedAt: '2025-05-01T10:35:00Z',
    },
    {
      id: 'b2',
      userId: '2',
      snowmobileId: 3,
      startDate: '2025-05-20T00:00:00Z',
      endDate: '2025-05-22T00:00:00Z',
      status: 'pending',
      totalAmount: 12000,
      createdAt: '2025-05-02T15:45:00Z',
      updatedAt: '2025-05-02T15:45:00Z',
    },
    {
      id: 'b3',
      userId: '3',
      snowmobileId: 2,
      startDate: '2025-05-05T00:00:00Z',
      endDate: '2025-05-08T00:00:00Z',
      status: 'completed',
      totalAmount: 18000,
      createdAt: '2025-04-20T09:15:00Z',
      updatedAt: '2025-05-09T14:30:00Z',
    },
    {
      id: 'b4',
      userId: '4',
      snowmobileId: 5,
      startDate: '2025-05-15T00:00:00Z',
      endDate: '2025-05-18T00:00:00Z',
      status: 'cancelled',
      totalAmount: 15000,
      createdAt: '2025-05-01T11:20:00Z',
      updatedAt: '2025-05-02T10:10:00Z',
    },
    {
      id: 'b5',
      userId: '2',
      snowmobileId: 4,
      startDate: '2025-06-01T00:00:00Z',
      endDate: '2025-06-07T00:00:00Z',
      status: 'confirmed',
      totalAmount: 35000,
      createdAt: '2025-05-15T16:40:00Z',
      updatedAt: '2025-05-15T17:05:00Z',
    },
  ];
  
  const { page, limit, search } = options;
  
  let filteredItems = [...mockBookings];
  
  // Применяем поиск, если указан
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.id.toLowerCase().includes(searchLower) || 
      item.userId.toLowerCase().includes(searchLower)
    );
  }
  
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filteredItems.slice(startIndex, endIndex);
  
  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}

function mockUsersData(options: PaginationOptions): PaginatedResult<User> {
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Администратор',
      role: 'admin',
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Иван Иванов',
      role: 'user',
      phone: '+7 (999) 123-45-67',
      createdAt: '2025-03-15T00:00:00Z',
    },
    {
      id: '3',
      email: 'elena@example.com',
      name: 'Елена Петрова',
      role: 'user',
      phone: '+7 (999) 987-65-43',
      createdAt: '2025-04-10T00:00:00Z',
    },
    {
      id: '4',
      email: 'mikhail@example.com',
      name: 'Михаил Сидоров',
      role: 'user',
      phone: '+7 (999) 456-78-90',
      createdAt: '2025-04-20T00:00:00Z',
    },
  ];
  
  const { page, limit, search } = options;
  
  let filteredItems = [...mockUsers];
  
  // Применяем поиск, если указан
  if (search) {
    const searchLower = search.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.email.toLowerCase().includes(searchLower)
    );
  }
  
  const total = filteredItems.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filteredItems.slice(startIndex, endIndex);
  
  return {
    items,
    total,
    page,
    limit,
    totalPages,
  };
}
