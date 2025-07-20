import { QueryClient } from '@tanstack/react-query';

// Настройки для QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время жизни кэша в миллисекундах (5 минут)
      staleTime: 5 * 60 * 1000,
      // Время до удаления неактивных данных (10 минут)
      gcTime: 10 * 60 * 1000,
      // Повторные запросы при ошибках
      retry: 2,
      // Интервал между повторными запросами
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Автоматическое обновление при фокусе окна
      refetchOnWindowFocus: false,
      // Автоматическое обновление при восстановлении соединения
      refetchOnReconnect: true,
    },
    mutations: {
      // Повторные попытки для мутаций
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Ключи для запросов
export const queryKeys = {
  // Снегоходы
  snowmobiles: {
    all: ['snowmobiles'] as const,
    lists: () => [...queryKeys.snowmobiles.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.snowmobiles.lists(), filters] as const,
    details: () => [...queryKeys.snowmobiles.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.snowmobiles.details(), id] as const,
  },
  
  // Бронирования
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
    user: (userId: string) => [...queryKeys.bookings.all, 'user', userId] as const,
  },
  
  // Пользователи
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    current: () => [...queryKeys.users.all, 'current'] as const,
  },
  
  // Статистика
  statistics: {
    all: ['statistics'] as const,
    dashboard: () => [...queryKeys.statistics.all, 'dashboard'] as const,
    bookings: () => [...queryKeys.statistics.all, 'bookings'] as const,
    revenue: () => [...queryKeys.statistics.all, 'revenue'] as const,
  },
  
  // Промокоды
  promoCodes: {
    all: ['promoCodes'] as const,
    validate: (code: string) => [...queryKeys.promoCodes.all, 'validate', code] as const,
  },
} as const;

// Утилиты для инвалидации кэша
export const invalidateQueries = {
  // Инвалидация всех запросов снегоходов
  snowmobiles: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.snowmobiles.all });
  },
  
  // Инвалидация конкретного снегохода
  snowmobile: (id: number) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.snowmobiles.detail(id) });
    queryClient.invalidateQueries({ queryKey: queryKeys.snowmobiles.lists() });
  },
  
  // Инвалидация всех бронирований
  bookings: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
  },
  
  // Инвалидация бронирований пользователя
  userBookings: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() });
  },
  
  // Инвалидация статистики
  statistics: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.statistics.all });
  },
  
  // Инвалидация пользователей
  users: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  },
  
  // Инвалидация текущего пользователя
  currentUser: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
  },
};

// Предварительная загрузка данных
export const prefetchQueries = {
  // Предзагрузка списка снегоходов
  snowmobiles: async (filters?: any) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.snowmobiles.list(filters),
      queryFn: () => {
        // Здесь будет реальный API вызов
        return Promise.resolve([]);
      },
    });
  },
  
  // Предзагрузка деталей снегохода
  snowmobileDetail: async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.snowmobiles.detail(id),
      queryFn: () => {
        // Здесь будет реальный API вызов
        return Promise.resolve(null);
      },
    });
  },
  
  // Предзагрузка бронирований пользователя
  userBookings: async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.bookings.user(userId),
      queryFn: () => {
        // Здесь будет реальный API вызов
        return Promise.resolve([]);
      },
    });
  },
};

// Оптимистичные обновления
export const optimisticUpdates = {
  // Оптимистичное создание бронирования
  createBooking: (newBooking: any) => {
    queryClient.setQueryData(
      queryKeys.bookings.user(newBooking.userId),
      (old: any[]) => [...(old || []), newBooking]
    );
  },
  
  // Оптимистичное обновление статуса бронирования
  updateBookingStatus: (bookingId: string, status: string) => {
    queryClient.setQueriesData(
      { queryKey: queryKeys.bookings.all },
      (old: any) => {
        if (!old) return old;
        
        if (Array.isArray(old)) {
          return old.map((booking: any) =>
            booking.id === bookingId ? { ...booking, status } : booking
          );
        }
        
        if (old.id === bookingId) {
          return { ...old, status };
        }
        
        return old;
      }
    );
  },
  
  // Оптимистичное обновление пользователя
  updateUser: (userId: string, updates: any) => {
    queryClient.setQueryData(
      queryKeys.users.detail(userId),
      (old: any) => ({ ...old, ...updates })
    );
  },
};

// Синхронизация данных между вкладками
export const syncAcrossTabs = () => {
  // Слушаем изменения в localStorage для синхронизации между вкладками
  window.addEventListener('storage', (event) => {
    if (event.key === 'queryClient-invalidate') {
      const data = JSON.parse(event.newValue || '{}');
      
      switch (data.type) {
        case 'bookings':
          invalidateQueries.bookings();
          break;
        case 'users':
          invalidateQueries.users();
          break;
        case 'snowmobiles':
          invalidateQueries.snowmobiles();
          break;
        case 'statistics':
          invalidateQueries.statistics();
          break;
      }
    }
  });
};

// Утилита для уведомления других вкладок об изменениях
export const notifyTabsOfChange = (type: string) => {
  localStorage.setItem('queryClient-invalidate', JSON.stringify({
    type,
    timestamp: Date.now(),
  }));
  // Удаляем через небольшой таймаут, чтобы событие успело сработать
  setTimeout(() => {
    localStorage.removeItem('queryClient-invalidate');
  }, 100);
};

export default queryClient;