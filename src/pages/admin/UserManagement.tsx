
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { userApi } from '@/lib/api';
import { User } from '@/types/user';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Поля формы редактирования
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  
  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        if (import.meta.env.DEV) {
          // В режиме разработки используем моковые данные
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Генерируем моковых пользователей
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
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
        } else {
          // В продакшене делаем запрос к API
          const result = await userApi.getUsers();
          setUsers(result);
          setFilteredUsers(result);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить список пользователей',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Фильтрация пользователей
  useEffect(() => {
    let filtered = [...users];
    
    // Поиск по имени или email
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.includes(query))
      );
    }
    
    // Фильтр по роли
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, users]);
  
  // Открытие диалога редактирования
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setIsEditDialogOpen(true);
  };
  
  // Сохранение изменений пользователя
  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      const updatedUser: User = {
        ...selectedUser,
        name: editName,
        email: editEmail,
        role: editRole,
        isActive: editIsActive,
        updatedAt: new Date().toISOString(),
      };
      
      if (import.meta.env.DEV) {
        // В режиме разработки имитируем запрос
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Обновляем локальный массив
        setUsers(users.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
      } else {
        // В продакшене вызываем API
        await userApi.updateUser(selectedUser.id, updatedUser);
        
        // Обновляем список пользователей
        const updatedUsers = await userApi.getUsers();
        setUsers(updatedUsers);
      }
      
      toast({
        title: 'Пользователь обновлен',
        description: `Данные пользователя ${updatedUser.name} успешно обновлены`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные пользователя',
        variant: 'destructive',
      });
    }
  };
  
  // Функция для изменения статуса пользователя
  const handleToggleUserStatus = async (user: User) => {
    try {
      const updatedUser: User = {
        ...user,
        isActive: !user.isActive,
        updatedAt: new Date().toISOString(),
      };
      
      if (import.meta.env.DEV) {
        // В режиме разработки имитируем запрос
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Обновляем локальный массив
        setUsers(users.map(u => 
          u.id === user.id ? updatedUser : u
        ));
      } else {
        // В продакшене вызываем API
        await userApi.updateUser(user.id, updatedUser);
        
        // Обновляем список пользователей
        const updatedUsers = await userApi.getUsers();
        setUsers(updatedUsers);
      }
      
      toast({
        title: updatedUser.isActive ? 'Пользователь активирован' : 'Пользователь деактивирован',
        description: `Статус пользователя ${updatedUser.name} успешно обновлен`,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус пользователя',
        variant: 'destructive',
      });
    }
  };
  
  // Получение метки для роли
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Администратор</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800">Менеджер</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800">Пользователь</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление пользователями</h1>
        <Button>
          <Icon name="UserPlus" className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>
      
      {/* Фильтры */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Icon name="Search" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Фильтр по роли" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="admin">Администраторы</SelectItem>
                <SelectItem value="manager">Менеджеры</SelectItem>
                <SelectItem value="user">Пользователи</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
              }}>
                <Icon name="X" className="mr-2 h-4 w-4" />
                Очистить фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Таблица пользователей */}
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
              <span>Загрузка пользователей...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10">
              <Icon name="Users" className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Пользователи не найдены</h3>
              <p className="mt-2 text-gray-500">
                По вашему запросу не найдено ни одного пользователя
              </p>
              {(searchQuery || roleFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                  }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Активен' : 'Заблокирован'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Меню действий</span>
                              <Icon name="MoreVertical" className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Действия</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Icon name="Edit" className="mr-2 h-4 w-4" />
                              Редактировать
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icon name="Mail" className="mr-2 h-4 w-4" />
                              Отправить сообщение
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                              {user.isActive ? (
                                <>
                                  <Icon name="Lock" className="mr-2 h-4 w-4" />
                                  Заблокировать
                                </>
                              ) : (
                                <>
                                  <Icon name="Unlock" className="mr-2 h-4 w-4" />
                                  Активировать
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Диалог редактирования пользователя */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование пользователя</DialogTitle>
            <DialogDescription>
              Измените информацию о пользователе и нажмите "Сохранить"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Введите имя пользователя"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                type="email"
                placeholder="Введите email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Роль</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="user-active"
                checked={editIsActive}
                onCheckedChange={(checked) => setEditIsActive(!!checked)}
              />
              <label
                htmlFor="user-active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Пользователь активен
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveUser}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
