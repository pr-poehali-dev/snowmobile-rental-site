
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { bookingApi, Booking, PaginationOptions } from '@/lib/api';

// Карта статусов для отображения
const statusMap: Record<Booking['status'], { label: string; color: string }> = {
  'pending': { label: 'Ожидание', color: 'bg-yellow-100 text-yellow-800' },
  'confirmed': { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800' },
  'cancelled': { label: 'Отменен', color: 'bg-red-100 text-red-800' },
  'completed': { label: 'Завершен', color: 'bg-green-100 text-green-800' },
};

const Bookings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Состояние для данных и пагинации
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [totalPages, setTotalPages] = useState(1);
  
  // Состояние для диалогов
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  // Загрузка бронирований
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await bookingApi.getBookings(paginationOptions);
      setBookings(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список бронирований',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка данных при изменении параметров пагинации
  useEffect(() => {
    fetchBookings();
  }, [paginationOptions]);
  
  // Обработчик отмены бронирования
  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      await bookingApi.cancelBooking(selectedBookingId);
      toast({
        title: 'Успешно',
        description: 'Бронирование отменено',
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить бронирование',
        variant: 'destructive',
      });
    } finally {
      setCancelDialogOpen(false);
      setSelectedBookingId(null);
    }
  };
  
  // Обработчик изменения статуса бронирования
  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, status);
      toast({
        title: 'Успешно',
        description: `Статус бронирования изменен на "${statusMap[status].label}"`,
      });
      fetchBookings();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус бронирования',
        variant: 'destructive',
      });
    }
  };
  
  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Бронирования</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Управление бронированиями</CardTitle>
          <CardDescription>
            Просмотр и управление всеми бронированиями снегоходов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Фильтры и поиск */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Поиск по ID или клиенту"
                value={paginationOptions.search || ''}
                onChange={(e) => 
                  setPaginationOptions((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1, // Сбрасываем страницу при изменении поиска
                  }))
                }
                className="w-full"
              />
            </div>
            <div className="w-40">
              <Select
                onValueChange={(value) => 
                  setPaginationOptions((prev) => ({
                    ...prev,
                    sort: value,
                    page: 1,
                  }))
                }
                defaultValue="createdAt"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">По дате создания</SelectItem>
                  <SelectItem value="startDate">По дате начала</SelectItem>
                  <SelectItem value="totalAmount">По стоимости</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-44">
              <Select
                onValueChange={(value) => 
                  setPaginationOptions((prev) => ({
                    ...prev,
                    status: value,
                    page: 1,
                  }))
                }
                defaultValue="all"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="confirmed">Подтверждено</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Таблица бронирований */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
              <span>Загрузка бронирований...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <Icon name="Calendar" className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Бронирований не найдено</h3>
              <p className="mt-1 text-gray-500">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Снегоход</TableHead>
                    <TableHead>Период</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="group">
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.userId}</TableCell>
                      <TableCell>{booking.snowmobileId}</TableCell>
                      <TableCell>
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </TableCell>
                      <TableCell>{booking.totalAmount.toLocaleString()} ₽</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusMap[booking.status].color}>
                          {statusMap[booking.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(booking.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Select
                            onValueChange={(value) => handleStatusChange(booking.id, value as Booking['status'])}
                            value={booking.status}
                            disabled={booking.status === 'cancelled'}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue placeholder="Изменить статус" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ожидание</SelectItem>
                              <SelectItem value="confirmed">Подтверждено</SelectItem>
                              <SelectItem value="completed">Завершено</SelectItem>
                              <SelectItem value="cancelled">Отменено</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBookingId(booking.id);
                              setCancelDialogOpen(true);
                            }}
                            disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                          >
                            <Icon name="X" className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                          >
                            <Icon name="Eye" className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Пагинация */}
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => 
                      setPaginationOptions((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={paginationOptions.page <= 1}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => 
                        setPaginationOptions((prev) => ({
                          ...prev,
                          page,
                        }))
                      }
                      isActive={page === paginationOptions.page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => 
                      setPaginationOptions((prev) => ({
                        ...prev,
                        page: Math.min(totalPages, prev.page + 1),
                      }))
                    }
                    disabled={paginationOptions.page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      {/* Диалог отмены бронирования */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить бронирование?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить это бронирование? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-red-500 hover:bg-red-600">
              Отменить бронирование
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Bookings;
