
import { Snowmobile, Filter, SortOption } from '@/types/snowmobile';
import { User } from '@/types/user';
import { snowmobiles, filterSnowmobiles } from '@/data/snowmobiles';

// Тип данных для пагинации
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Тип данных для бронирования
export interface Booking {
  id: string;
  userId: string;
  snowmobileId: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// Тип данных для создания бронирования
export interface BookingCreateData {
  snowmobileId: number;
  startDate: string;
  endDate: string;
  quantity: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

// API для работы со снегоходами
export const snowmobileApi = {
  // Получение всех снегоходов с фильтрацией
  getSnowmobiles: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      filter?: Filter;
      sort?: SortOption;
    } = {}
  ): Promise<PaginatedResponse<Snowmobile>> => {
    // В реальном приложении здесь был бы запрос к API
    const {
      page = 1,
      limit = 10,
      search = '',
      filter = { brands: [], categories: [], availability: null, priceRange: [0, 10000] },
      sort = 'price-asc'
    } = params;
    
    // Фильтрация и поиск
    let filtered = [...snowmobiles];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(searchLower) || 
             s.description.toLowerCase().includes(searchLower) ||
             s.brand.toLowerCase().includes(searchLower)
      );
    }
    
    filtered = filterSnowmobiles(filtered, filter, sort);
    
    // Пагинация
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filtered.slice(start, end);
    
    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  },
  
  // Получение снегохода по ID
  getSnowmobileById: async (id: number): Promise<Snowmobile> => {
    // В реальном приложении здесь был бы запрос к API
    const snowmobile = snowmobiles.find(s => s.id === id);
    
    if (!snowmobile) {
      throw new Error(`Snowmobile with ID ${id} not found`);
    }
    
    return snowmobile;
  },
  
  // Обновление снегохода
  updateSnowmobile: async (id: number, data: Partial<Snowmobile>): Promise<Snowmobile> => {
    // В реальном приложении здесь был бы запрос к API
    const index = snowmobiles.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Snowmobile with ID ${id} not found`);
    }
    
    // Для демо просто обновляем локальный массив
    const updatedSnowmobile = {
      ...snowmobiles[index],
      ...data,
    };
    
    // В реальном приложении здесь был бы запрос к API
    return updatedSnowmobile;
  }
};

// API для работы с бронированиями
export const bookingApi = {
  // Получение списка бронирований
  getBookings: async (
    params: {
      page?: number;
      limit?: number;
      userId?: string;
      snowmobileId?: number;
      status?: Booking['status'];
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedResponse<Booking>> => {
    // В реальном приложении здесь был бы запрос к API
    const { page = 1, limit = 10 } = params;
    
    // Моковые данные для режима разработки
    const mockBookings: Booking[] = [
      {
        id: '1',
        userId: '1',
        snowmobileId: 1,
        startDate: '2025-05-10T00:00:00Z',
        endDate: '2025-05-15T00:00:00Z',
        totalAmount: 25000,
        status: 'confirmed',
        quantity: 1,
        createdAt: '2025-05-01T10:30:00Z',
        updatedAt: '2025-05-01T12:45:00Z'
      },
      {
        id: '2',
        userId: '2',
        snowmobileId: 3,
        startDate: '2025-05-20T00:00:00Z',
        endDate: '2025-05-22T00:00:00Z',
        totalAmount: 13500,
        status: 'pending',
        quantity: 1,
        createdAt: '2025-05-05T09:15:00Z',
        updatedAt: '2025-05-05T09:15:00Z'
      },
      {
        id: '3',
        userId: '3',
        snowmobileId: 5,
        startDate: '2025-06-01T00:00:00Z',
        endDate: '2025-06-05T00:00:00Z',
        totalAmount: 32500,
        status: 'cancelled',
        quantity: 1,
        createdAt: '2025-05-10T15:20:00Z',
        updatedAt: '2025-05-12T11:30:00Z'
      },
      {
        id: '4',
        userId: '1',
        snowmobileId: 2,
        startDate: '2025-06-10T00:00:00Z',
        endDate: '2025-06-15T00:00:00Z',
        totalAmount: 36000,
        status: 'completed',
        quantity: 2,
        createdAt: '2025-05-15T08:40:00Z',
        updatedAt: '2025-06-16T14:20:00Z'
      },
      {
        id: '5',
        userId: '4',
        snowmobileId: 4,
        startDate: '2025-06-25T00:00:00Z',
        endDate: '2025-06-27T00:00:00Z',
        totalAmount: 15000,
        status: 'confirmed',
        quantity: 1,
        createdAt: '2025-05-20T16:10:00Z',
        updatedAt: '2025-05-21T10:05:00Z'
      }
    ];
    
    // Фильтрация по параметрам
    let filtered = [...mockBookings];
    
    if (params.userId) {
      filtered = filtered.filter(b => b.userId === params.userId);
    }
    
    if (params.snowmobileId) {
      filtered = filtered.filter(b => b.snowmobileId === params.snowmobileId);
    }
    
    if (params.status) {
      filtered = filtered.filter(b => b.status === params.status);
    }
    
    if (params.startDate) {
      const start = new Date(params.startDate);
      filtered = filtered.filter(b => new Date(b.startDate) >= start);
    }
    
    if (params.endDate) {
      const end = new Date(params.endDate);
      filtered = filtered.filter(b => new Date(b.endDate) <= end);
    }
    
    // Пагинация
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = filtered.slice(start, end);
    
    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };
  },
  
  // Получение бронирования по ID
  getBookingById: async (id: string): Promise<Booking> => {
    // Для режима разработки просто имитируем запрос
    const result = await bookingApi.getBookings();
    const booking = result.items.find(b => b.id === id);
    
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    return booking;
  },
  
  // Создание бронирования
  createBooking: async (data: BookingCreateData): Promise<Booking> => {
    // В реальном приложении здесь был бы запрос к API
    
    // Для режима разработки просто возвращаем моковые данные
    const newBooking: Booking = {
      id: Math.random().toString(36).substring(2, 9),
      userId: '1', // В реальном приложении это был бы ID текущего пользователя
      snowmobileId: data.snowmobileId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalAmount: 15000, // В реальном приложении здесь был бы расчет
      status: 'pending',
      quantity: data.quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newBooking;
  },
  
  // Обновление статуса бронирования
  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    // В реальном приложении здесь был бы запрос к API
    const result = await bookingApi.getBookings();
    const booking = result.items.find(b => b.id === id);
    
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    // Для демо просто обновляем статус
    const updatedBooking: Booking = {
      ...booking,
      status,
      updatedAt: new Date().toISOString()
    };
    
    return updatedBooking;
  },
  
  // Получение занятых дат для снегохода
  getBookedDates: async (snowmobileId: number): Promise<{start: Date; end: Date}[]> => {
    // В реальном приложении здесь был бы запрос к API
    
    // Для режима разработки возвращаем моковые данные
    const bookings = await bookingApi.getBookings({ snowmobileId });
    
    const bookedDates = bookings.items
      .filter(b => ['confirmed', 'pending'].includes(b.status))
      .map(b => ({
        start: new Date(b.startDate),
        end: new Date(b.endDate)
      }));
    
    return bookedDates;
  }
};

// API для работы с пользователями
export const userApi = {
  // Получение списка пользователей
  getUsers: async (): Promise<User[]> => {
    // В реальном приложении здесь был бы запрос к API
    
    // Моковые данные для режима разработки
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Алексей Иванов',
        email: 'alex@example.com',
        role: 'admin',
        createdAt: '2023-12-05T10:30:00Z',
        updatedAt: '2023-12-05T10:30:00Z',
        isActive: true,
        phone: '+7 (900) 123-45-67'
      },
      {
        id: '2',
        name: 'Мария Смирнова',
        email: 'maria@example.com',
        role: 'manager',
        createdAt: '2024-01-15T14:20:00Z',
        updatedAt: '2024-02-10T09:15:00Z',
        isActive: true,
        phone: '+7 (900) 987-65-43'
      },
      {
        id: '3',
        name: 'Сергей Петров',
        email: 'sergey@example.com',
        role: 'user',
        createdAt: '2024-02-03T11:45:00Z',
        updatedAt: '2024-02-03T11:45:00Z',
        isActive: true,
        phone: '+7 (900) 555-66-77'
      },
      {
        id: '4',
        name: 'Екатерина Козлова',
        email: 'ekaterina@example.com',
        role: 'user',
        createdAt: '2024-02-20T08:30:00Z',
        updatedAt: '2024-03-15T16:40:00Z',
        isActive: false,
        phone: '+7 (900) 333-22-11'
      },
      {
        id: '5',
        name: 'Дмитрий Николаев',
        email: 'dmitry@example.com',
        role: 'manager',
        createdAt: '2024-03-10T13:10:00Z',
        updatedAt: '2024-03-10T13:10:00Z',
        isActive: true,
        phone: '+7 (900) 444-55-66'
      },
    ];
    
    return mockUsers;
  },
  
  // Получение пользователя по ID
  getUserById: async (id: string): Promise<User> => {
    // В реальном приложении здесь был бы запрос к API
    const users = await userApi.getUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    return user;
  },
  
  // Обновление пользователя
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    // В реальном приложении здесь был бы запрос к API
    const users = await userApi.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Для демо просто обновляем локальный объект
    const updatedUser: User = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return updatedUser;
  }
};
