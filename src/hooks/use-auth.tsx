
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCredentials, UserRegistration, AuthState } from '@/types/user';

// Создаем контекст для авторизации
interface AuthContextType extends AuthState {
  login: (credentials: UserCredentials) => Promise<void>;
  register: (data: UserRegistration) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Моковые данные пользователей для демонстрации
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
];

// Пароли тестовых пользователей (в реальном приложении хранились бы на сервере и хэшировались)
const mockPasswords: Record<string, string> = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user123',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  // При инициализации проверяем, есть ли сохраненная сессия
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as User;
        setAuthState({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Функция для входа в систему
  const login = async (credentials: UserCredentials): Promise<void> => {
    // В реальном приложении здесь был бы запрос к API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (user && mockPasswords[credentials.email] === credentials.password) {
          // Успешная авторизация
          const newState = {
            user,
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
          };
          setAuthState(newState);
          localStorage.setItem('user', JSON.stringify(user));
          resolve();
        } else {
          // Ошибка авторизации
          reject(new Error('Неверный email или пароль'));
        }
      }, 500); // Имитация задержки сетевого запроса
    });
  };

  // Функция для регистрации
  const register = async (data: UserRegistration): Promise<void> => {
    // В реальном приложении здесь был бы запрос к API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Проверяем, существует ли пользователь с таким email
        if (mockUsers.some(u => u.email === data.email)) {
          reject(new Error('Пользователь с таким email уже существует'));
          return;
        }
        
        // В реальном приложении пользователь был бы создан в базе данных
        // В демо-версии просто возвращаем успех
        resolve();
      }, 500); // Имитация задержки сетевого запроса
    });
  };

  // Функция для выхода из системы
  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста аутентификации
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
