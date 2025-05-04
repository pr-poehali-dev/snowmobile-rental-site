
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { bookingApi, Booking, snowmobileApi } from '@/lib/api';
import { userApi } from '@/lib/api';
import { Snowmobile } from '@/types/snowmobile';
import { User } from '@/types/user';

// Карта статусов для отображения
const statusMap: Record<Booking['status'], { label: string; color: string; icon: string }> = {
  'pending': { label: 'Ожидание', color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
  'confirmed': { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800', icon: 'CheckCircle' },
  'cancelled': { label: 'Отменен', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
  'completed': { label: 'Завершен', color: 'bg-green-100 text-green-800', icon: 'Check' },
};

// Интерфейс для истории статусов
interface StatusHistory {
  status: Booking['status'];
  timestamp: string;
  comment?: string;
  userId?: string;
}

// Моковые данные для истории статусов
const mockStatusHistory: StatusHistory[] = [
  { status: 'pending', timestamp: '2025-05-01T10:30:00Z' },
  { status: 'confirmed', timestamp: '2025-05-01T12:45:00Z', comment: 'Проверена оплата', userId: '1' },
  { status: 'completed', timestamp: '2025-05-16T09:15:00Z', comment: 'Клиент вернул снегоход в хорошем состоянии', userId: '1' },
];

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [snowmobile, setSnowmobile] = useState<Snowmobile | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [newStatus, setNewStatus] = useState<Booking['status'] | ''>('');
  const [statusComment, setStatusComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        // В демо-режиме используем моковые данные
        if (import.meta.env.DEV) {
          // Имитация задержки запроса
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Получаем бронирование из моковых данных
          const mockBookings = await bookingApi.getBookings({ page: 1, limit: 10 });
          const bookingData = mockBookings.items.find(b => b.id === id);
          
          if (!bookingData) {
            throw new Error('Бронирование не найдено');
          }
          
          setBooking(bookingData);
          
          // Получаем данные о снегоходе
          const snowmobileData = await snowmobileApi.getSnowmobileById(bookingData.snowmobileId);
          setSnowmobile(snowmobileData);
          
          // Получаем данные о клиенте
          const userData = await userApi.getUserById(bookingData.userId);
          setCustomer(userData);
          
          // Устанавливаем историю статусов
          setStatusHistory(mockStatusHistory);
        } else {
          // В продакшн-режиме вызываем реальный API
          const bookingData = await bookingApi.getBookingById(id);
          setBooking(bookingData);
          
          const snowmobileData = await snowmobileApi.getSnowmobileById(bookingData.snowmobileId);
          setSnowmobile(snowmobileData);
          
          const userData = await userApi.getUserById(bookingData.userId);
          setCustomer(userData);
          
          // Получаем историю статусов
          // const historyData = await bookingApi.getBookingStatusHistory(id);
          // setStatusHistory(historyData);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные бронирования',
          variant: 'destructive',
        });
        navigate('/admin/bookings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id, navigate, toast]);
  
  // Обработчик изменения статуса
  const handleStatusChange = async () => {
    if (!booking || !newStatus) return;
    
    try {
      await bookingApi.updateBookingStatus(booking.id, newStatus as Booking['status']);
      
      // Обновляем локальное состояние
      setBooking(prev => prev ? { ...prev, status: newStatus as Booking['status'] } : null);
      
      // Добавляем запись в историю статусов
      const newHistoryItem: StatusHistory = {
        status: newStatus as Booking['status'],
        timestamp: new Date().toISOString(),
        comment: statusComment,
        userId: '1', // В реальном приложении здесь будет ID текущего пользователя
      };
      
      setStatusHistory(prev => [...prev, newHistoryItem]);
      
      toast({
        title: 'Статус обновлен',
        description: `Статус бронирования изменен на "${statusMap[newStatus as Booking['status']].label}"`,
      });
      
      // Сбрасываем поля формы
      setNewStatus('');
      setStatusComment('');
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус бронирования',
        variant: 'destructive',
      });
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
        <span>Загрузка данных бронирования...</span>
      </div>
    );
  }
  
  if (!booking || !snowmobile || !customer) {
    return (
      <div className="text-center py-10">
        <Icon name="AlertTriangle" className="mx-auto h-10 w-10 text-yellow-500" />
        <h3 className="mt-4 text-lg font-medium">Бронирование не найдено</h3>
        <p className="mt-1 text-gray-500">
          Запрашиваемое бронирование не существует или было удалено
        </p>
        <Button onClick={() => navigate('/admin/bookings')} className="mt-4">
          Вернуться к списку
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Бронирование #{booking.id}
            <Badge className={`ml-3 ${statusMap[booking.status].color}`} variant="outline">
              <Icon name={statusMap[booking.status].icon} className="mr-1 h-3 w-3" />
              {statusMap[booking.status].label}
            </Badge>
          </h1>
          <p className="text-gray-500">Создано: {formatDate(booking.createdAt)}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад к списку
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Edit2" className="mr-2 h-4 w-4" />
                Изменить статус
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Изменить статус бронирования</DialogTitle>
                <DialogDescription>
                  Выберите новый статус для бронирования #{booking.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Новый статус</label>
                  <Select onValueChange={setNewStatus} value={newStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Ожидание</SelectItem>
                      <SelectItem value="confirmed">Подтверждено</SelectItem>
                      <SelectItem value="completed">Завершено</SelectItem>
                      <SelectItem value="cancelled">Отменено</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Комментарий (опционально)</label>
                  <Textarea
                    placeholder="Добавьте комментарий о причине изменения статуса"
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleStatusChange} disabled={!newStatus}>
                  Сохранить изменения
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основные детали */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о бронировании</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Период аренды</h3>
                  <p className="font-medium">
                    {formatDate(booking.startDate).split(',')[0]} — {formatDate(booking.endDate).split(',')[0]}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Стоимость</h3>
                  <p className="font-medium text-lg">{booking.totalAmount.toLocaleString()} ₽</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Снегоход</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md overflow-hidden">
                      <img
                        src={snowmobile.images?.[0] || 'https://images.unsplash.com/photo-1578307980242-df3167d9e397?w=150'}
                        alt={snowmobile.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{snowmobile.name}</p>
                      <p className="text-sm text-gray-500">ID: {snowmobile.id}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Последнее обновление</h3>
                  <p>{formatDate(booking.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">История статусов</TabsTrigger>
              <TabsTrigger value="notes">Заметки</TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {statusHistory.map((item, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 relative">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${statusMap[item.status].color}`}>
                            <Icon name={statusMap[item.status].icon} className="h-4 w-4" />
                          </div>
                          {index < statusHistory.length - 1 && (
                            <div className="absolute top-8 bottom-0 left-1/2 w-0.5 -ml-px bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              Статус изменен на "{statusMap[item.status].label}"
                            </h4>
                            <time className="text-sm text-gray-500">{formatDate(item.timestamp)}</time>
                          </div>
                          {item.comment && (
                            <p className="mt-1 text-gray-600">{item.comment}</p>
                          )}
                          {item.userId && (
                            <p className="mt-1 text-xs text-gray-500">
                              Изменено администратором
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4 items-start">
                    <Textarea
                      placeholder="Добавьте заметку о бронировании..."
                      className="flex-1"
                    />
                    <Button>Сохранить</Button>
                  </div>
                  <div className="mt-6">
                    <Alert>
                      <Icon name="Info" className="h-4 w-4" />
                      <AlertTitle>Заметки отсутствуют</AlertTitle>
                      <AlertDescription>
                        К этому бронированию еще не добавлено ни одной заметки
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Боковая панель с информацией о клиенте */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Информация о клиенте</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-lg">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">Клиент</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" className="h-4 w-4 text-gray-500" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Phone" className="h-4 w-4 text-gray-500" />
                    <span>{customer.phone || 'Не указан'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="h-4 w-4 text-gray-500" />
                    <span>Регистрация: {formatDate(customer.createdAt).split(',')[0]}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Button variant="outline" className="w-full">
                    <Icon name="User" className="mr-2 h-4 w-4" />
                    Профиль клиента
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Связь с клиентом</CardTitle>
              <CardDescription>
                Отправьте сообщение клиенту напрямую
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Icon name="Mail" className="mr-2 h-4 w-4" />
                  Отправить email
                </Button>
                {customer.phone && (
                  <Button variant="outline" className="w-full">
                    <Icon name="Phone" className="mr-2 h-4 w-4" />
                    Позвонить клиенту
                  </Button>
                )}
                <Button className="w-full">
                  <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
                  Написать сообщение
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
