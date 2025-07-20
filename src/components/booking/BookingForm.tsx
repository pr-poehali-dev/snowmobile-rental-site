
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format, differenceInCalendarDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { bookingApi, BookingCreateData } from '@/lib/api';
import { Snowmobile } from '@/types/snowmobile';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import BookingCalendar from './BookingCalendar';

interface BookingFormData {
  quantity: number;
  name: string;
  email: string;
  phone: string;
  additionalInfo?: string;
}

interface BookingFormProps {
  snowmobile: Snowmobile;
}

const BookingForm = ({ snowmobile }: BookingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [total, setTotal] = useState<number>(0);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BookingFormData>({
    defaultValues: {
      quantity: 1,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });
  
  const quantity = watch('quantity');
  
  // Обновляем поля формы при изменении данных пользователя
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
    }
  }, [isAuthenticated, user, setValue]);
  
  // Обновляем расчеты при изменении дат или количества
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInCalendarDays(endDate, startDate) + 1;
      const pricePerDay = snowmobile.price || 0;
      setTotal(pricePerDay * days * quantity);
    } else {
      setTotal(0);
    }
  }, [startDate, endDate, quantity, snowmobile.price]);
  
  // Обработчик выбора дат из календаря
  const handleDateSelect = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
  };
  
  // Обработчик отправки формы
  const onSubmit = async (data: BookingFormData) => {
    if (!startDate || !endDate) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите даты аренды',
        variant: 'destructive',
      });
      return;
    }
    
    // Перенаправляем на страницу оформления заказа с параметрами
    const searchParams = new URLSearchParams({
      snowmobileId: snowmobile.id.toString(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      quantity: data.quantity.toString(),
    });
    
    navigate(`/checkout?${searchParams.toString()}`);
  };
  
  return (
    <div className="space-y-6">
      <BookingCalendar 
        snowmobile={snowmobile} 
        onDateSelect={handleDateSelect} 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Детали бронирования</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Количество снегоходов */}
            <div className="mb-4">
              <Label htmlFor="quantity">Количество снегоходов</Label>
              <Select
                value={quantity.toString()}
                onValueChange={(value) => setValue('quantity', parseInt(value))}
              >
                <SelectTrigger id="quantity" className="w-full">
                  <SelectValue placeholder="Выберите количество" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'снегоход' : num < 5 ? 'снегохода' : 'снегоходов'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {!isAuthenticated && (
              <>
                <div className="mb-4">
                  <Label htmlFor="name">ФИО</Label>
                  <Input
                    id="name"
                    placeholder="Введите ваше полное имя"
                    {...register('name', { required: 'Имя обязательно' })}
                    className={errors.name ? 'border-red-300' : ''}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Введите ваш email"
                    {...register('email', { 
                      required: 'Email обязателен',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Некорректный email'
                      }
                    })}
                    className={errors.email ? 'border-red-300' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    placeholder="+7 (___) ___-__-__"
                    {...register('phone', { 
                      required: 'Телефон обязателен',
                      pattern: {
                        value: /^(\+7|8)[\s(]?\d{3}[)\s]?[\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
                        message: 'Некорректный формат телефона'
                      }
                    })}
                    className={errors.phone ? 'border-red-300' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </>
            )}
            
            {/* Дополнительная информация */}
            <div>
              <Label htmlFor="additionalInfo" className="mb-1">Дополнительная информация</Label>
              <Input
                id="additionalInfo"
                placeholder="Особые пожелания или требования"
                {...register('additionalInfo')}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          {/* Итоговая стоимость */}
          {startDate && endDate && (
            <div className="w-full mb-4">
              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="font-medium mb-2">Итого:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Период аренды:</span>
                    <span>
                      {format(startDate, 'dd.MM.yyyy', { locale: ru })} - {format(endDate, 'dd.MM.yyyy', { locale: ru })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Продолжительность:</span>
                    <span>{differenceInCalendarDays(endDate, startDate) + 1} дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Количество:</span>
                    <span>{quantity} шт.</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-base">
                    <span>Итоговая стоимость:</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row w-full gap-3">
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
              >
                <Icon name="LogIn" className="mr-2 h-4 w-4" />
                Войти для бронирования
              </Button>
            )}
            <Button
              type="submit"
              form="booking-form"
              className="w-full"
              disabled={!startDate || !endDate}
            >
              <Icon name="ShoppingCart" className="mr-2 h-4 w-4" />
              Перейти к оплате
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingForm;