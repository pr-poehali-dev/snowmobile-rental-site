
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { bookingApi, Booking } from '@/lib/api';
import { snowmobileApi } from '@/lib/api';
import { Snowmobile } from '@/types/snowmobile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [snowmobiles, setSnowmobiles] = useState<Record<number, Snowmobile>>({});

  // Редирект неавторизованных пользователей
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  // Загрузка бронирований пользователя
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        const response = await bookingApi.getBookings({ userId: user.id });
        setBookings(response.items);
        
        // Фильтрация бронирований по статусу
        const now = new Date();
        const active: Booking[] = [];
        const past: Booking[] = [];
        const cancelled: Booking[] = [];
        
        response.items.forEach(booking => {
          const endDate = new Date(booking.endDate);
          
          if (booking.status === 'cancelled') {
            cancelled.push(booking);
          } else if (booking.status === 'completed' || endDate < now) {
            past.push(booking);
          } else {
            active.push(booking);
          }
        });
        
        setActiveBookings(active);
        setPastBookings(past);
        setCancelledBookings(cancelled);
        
        // Загрузка данных о снегоходах для отображения
        const snowmobileIds = new Set(response.items.map(b => b.snowmobileId));
        const snowmobilesData: Record<number, Snowmobile> = {};
        
        for (const id of snowmobileIds) {
          try {
            const snowmobile = await snowmobileApi.getSnowmobileById(id);
            snowmobilesData[id] = snowmobile;
          } catch (error) {
            console.error(`Error fetching snowmobile #${id}:`, error);
          }
        }
        
        setSnowmobiles(snowmobilesData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить ваши бронирования',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated, user, toast]);

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  // Получение статуса бронирования
  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">В обработке</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Подтверждено</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Отменено</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Завершено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Обработчик отмены бронирования
  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, 'cancelled');
      
      // Обновляем локальный список бронирований
      const cancelled = bookings.find(b => b.id === bookingId);
      if (cancelled) {
        setActiveBookings(activeBookings.filter(b => b.id !== bookingId));
        setCancelledBookings([...cancelledBookings, { ...cancelled, status: 'cancelled' }]);
      }
      
      toast({
        title: 'Бронирование отменено',
        description: 'Ваше бронирование успешно отменено',
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить бронирование',
        variant: 'destructive',
      });
    }
  };

  // Компонент для отображения бронирования
  const BookingCard = ({ booking }: { booking: Booking }) => {
    const snowmobile = snowmobiles[booking.snowmobileId];
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{snowmobile?.name || `Снегоход #${booking.snowmobileId}`}</CardTitle>
              <CardDescription>
                Бронирование #{booking.id.slice(0, 8)} от {format(new Date(booking.createdAt), 'dd.MM.yyyy')}
              </CardDescription>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Детали бронирования</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Период:</span>
                  <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Количество:</span>
                  <span>{booking.quantity} шт.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Стоимость:</span>
                  <span className="font-medium">{booking.totalAmount.toLocaleString()} ₽</span>
                </div>
              </div>
            </div>
            
            {snowmobile && (
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                  <img 
                    src={snowmobile.image || 'https://images.unsplash.com/photo-1516199423456-1f1e91b06f25?w=100&q=80'} 
                    alt={snowmobile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{snowmobile.name}</div>
                  <div className="text-sm text-gray-500">{snowmobile.brand}</div>
                  <div className="text-sm">
                    {snowmobile.specifications?.engineType}, {snowmobile.specifications?.power}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/snowmobile/${booking.snowmobileId}`)}
            >
              <Icon name="ExternalLink" className="mr-2 h-4 w-4" />
              Просмотреть снегоход
            </Button>
            
            {booking.status === 'pending' || booking.status === 'confirmed' ? (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => handleCancelBooking(booking.id)}
              >
                <Icon name="X" className="mr-2 h-4 w-4" />
                Отменить бронирование
              </Button>
            ) : booking.status === 'completed' ? (
              <Button className="w-full">
                <Icon name="Star" className="mr-2 h-4 w-4" />
                Оставить отзыв
              </Button>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    );
  };

  // Отображение для неавторизованных пользователей (хотя этот случай должен обрабатываться редиректом)
  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <Icon name="UserX" className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold">Требуется авторизация</h2>
            <p className="mt-2 text-gray-600">
              Для доступа к личному кабинету необходимо авторизоваться
            </p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Войти
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Левая колонка (профиль) */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Телефон</h3>
                    <p>{user.phone || 'Не указан'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Дата регистрации</h3>
                    <p>{formatDate(user.createdAt)}</p>
                  </div>
                  <Separator />
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={() => navigate('/profile/edit')}>
                      <Icon name="Edit" className="mr-2 h-4 w-4" />
                      Редактировать профиль
                    </Button>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={logout}>
                      <Icon name="LogOut" className="mr-2 h-4 w-4" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Правая колонка (бронирования) */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold mb-6">Мои бронирования</h1>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
                <span>Загрузка бронирований...</span>
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Icon name="Calendar" className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">У вас пока нет бронирований</h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    Чтобы забронировать снегоход, перейдите в каталог и выберите подходящую модель
                  </p>
                  <Button
                    onClick={() => navigate('/catalog')}
                    className="mt-6"
                  >
                    Перейти в каталог
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="active">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="active" className="relative">
                    Активные
                    {activeBookings.length > 0 && (
                      <Badge className="ml-2">{activeBookings.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Завершенные
                    {pastBookings.length > 0 && (
                      <Badge className="ml-2">{pastBookings.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Отмененные
                    {cancelledBookings.length > 0 && (
                      <Badge className="ml-2">{cancelledBookings.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="space-y-6">
                  {activeBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Icon name="Calendar" className="mx-auto h-10 w-10 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Нет активных бронирований</h3>
                      <p className="mt-2 text-gray-500">
                        У вас нет активных бронирований в данный момент
                      </p>
                      <Button
                        onClick={() => navigate('/catalog')}
                        className="mt-4"
                      >
                        Перейти в каталог
                      </Button>
                    </div>
                  ) : (
                    activeBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-6">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Icon name="HistoryIcon" className="mx-auto h-10 w-10 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Нет завершенных бронирований</h3>
                      <p className="mt-2 text-gray-500">
                        У вас еще нет завершенных бронирований
                      </p>
                    </div>
                  ) : (
                    pastBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-6">
                  {cancelledBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Icon name="XCircle" className="mx-auto h-10 w-10 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Нет отмененных бронирований</h3>
                      <p className="mt-2 text-gray-500">
                        У вас нет отмененных бронирований
                      </p>
                    </div>
                  ) : (
                    cancelledBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
