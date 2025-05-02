
import { User } from '@/types/user';

// Моковые данные пользователей для административной панели
export const users: User[] = [
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
    email: 'anna@example.com',
    name: 'Анна Петрова',
    role: 'user',
    phone: '+7 (999) 987-65-43',
    createdAt: '2025-04-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'sergey@example.com',
    name: 'Сергей Сидоров',
    role: 'user',
    phone: '+7 (888) 111-22-33',
    createdAt: '2025-04-10T00:00:00Z',
  },
  {
    id: '5',
    email: 'elena@example.com',
    name: 'Елена Смирнова',
    role: 'user',
    phone: '+7 (777) 444-55-66',
    createdAt: '2025-04-20T00:00:00Z',
  }
];

// Получение пользователя по email
export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

// Получение пользователя по id
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Фильтрация пользователей
export const filterUsers = (query: string, roleFilter: 'all' | 'user' | 'admin'): User[] => {
  return users.filter(user => {
    const matchesQuery = 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      (user.phone && user.phone.includes(query));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesQuery && matchesRole;
  });
};
