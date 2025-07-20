import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart, cartUtils } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  additionalInfo?: string;
  emergencyContact?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  insuranceAccepted: boolean;
  termsAccepted: boolean;
}

interface CartBookingFormProps {
  onBack?: () => void;
}

export default function CartBookingForm({ onBack }: CartBookingFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { state: cartState, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<BookingFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      experienceLevel: 'beginner',
      insuranceAccepted: false,
      termsAccepted: false,
    }
  });

  const experienceLevel = watch('experienceLevel');
  const insuranceAccepted = watch('insuranceAccepted');
  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: BookingFormData) => {
    if (!insuranceAccepted || !termsAccepted) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо принять условия страхования и пользовательское соглашение',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Симуляция отправки данных на сервер
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Создаем номер брони
      const bookingNumber = `SNW-${Date.now().toString().slice(-6)}`;

      // Очищаем корзину
      clearCart();

      // Перенаправляем на страницу подтверждения
      navigate(`/booking-confirmation/${bookingNumber}`, {
        state: {
          bookingData: {
            ...data,
            items: cartState.items,
            total: cartState.total,
            bookingNumber,
            createdAt: new Date().toISOString(),
          }
        }
      });

      toast({
        title: 'Бронирование оформлено!',
        description: `Номер брони: ${bookingNumber}`,
      });

    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при оформлении бронирования. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalDays = () => {
    const uniqueDates = new Set();
    cartState.items.forEach(item => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        uniqueDates.add(d.toDateString());
      }
    });
    return uniqueDates.size;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Заголовок */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <Icon name="ArrowLeft" size={16} />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Оформление бронирования</h1>
          <p className="text-gray-600">Заполните данные для завершения бронирования</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Форма бронирования */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="User" size={20} />
                Данные для бронирования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Личные данные */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Личные данные</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">ФИО *</Label>
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

                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
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
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
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

                  <div>
                    <Label htmlFor="emergencyContact">Контакт для экстренной связи</Label>
                    <Input
                      id="emergencyContact"
                      placeholder="Имя и телефон близкого человека"
                      {...register('emergencyContact')}
                    />
                  </div>
                </div>

                {/* Опыт вождения */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Опыт вождения</h3>
                  
                  <div>
                    <Label>Уровень опыта *</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { value: 'beginner', label: 'Новичок', desc: 'Первый раз или менее 5 поездок' },
                        { value: 'intermediate', label: 'Средний', desc: 'Регулярно катаюсь, есть опыт' },
                        { value: 'advanced', label: 'Эксперт', desc: 'Профессиональный уровень' }
                      ].map((level) => (
                        <div key={level.value}>
                          <input
                            type="radio"
                            id={level.value}
                            value={level.value}
                            {...register('experienceLevel', { required: true })}
                            className="hidden"
                          />
                          <label
                            htmlFor={level.value}
                            className={`block p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              experienceLevel === level.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-sm">{level.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div>
                  <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Особые пожелания, требования к маршруту, медицинские ограничения и т.д."
                    {...register('additionalInfo')}
                    rows={3}
                  />
                </div>

                {/* Согласия */}
                <div className="space-y-3">
                  <h3 className="font-medium text-lg border-b pb-2">Согласия</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('insuranceAccepted', { required: true })}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <div className="font-medium">Страхование *</div>
                        <div className="text-gray-600">
                          Я понимаю риски, связанные с катанием на снегоходе, и принимаю условия страхования.
                          В стоимость аренды включена базовая страховка.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('termsAccepted', { required: true })}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <div className="font-medium">Пользовательское соглашение *</div>
                        <div className="text-gray-600">
                          Я принимаю условия аренды и правила использования снегоходов.
                          Ознакомлен с техникой безопасности.
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Сводка заказа */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Receipt" size={20} />
                Сводка заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Список позиций */}
              <div className="space-y-3">
                {cartState.items.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="font-medium">{item.snowmobile.name}</div>
                    <div className="text-gray-600 text-xs">
                      {cartUtils.formatDate(item.startDate)} - {cartUtils.formatDate(item.endDate)}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-gray-600">
                        {item.quantity} × {item.durationDays} дн.
                      </span>
                      <span className="font-medium">
                        {cartUtils.formatPrice(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Итоговая информация */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Позиций в заказе:</span>
                  <span>{cartState.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Общее количество:</span>
                  <span>{cartState.itemCount} шт.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Общий период:</span>
                  <Badge variant="secondary">{getTotalDays()} дн.</Badge>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Итого:</span>
                <span>{cartUtils.formatPrice(cartState.total)}</span>
              </div>

              <div className="text-xs text-gray-500">
                <Icon name="Info" size={12} className="inline mr-1" />
                В стоимость включены: базовая страховка, топливо, инструктаж
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                form="booking-form"
                className="w-full"
                disabled={isSubmitting || !insuranceAccepted || !termsAccepted}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Оформление...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" size={18} className="mr-2" />
                    Оформить бронирование
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}