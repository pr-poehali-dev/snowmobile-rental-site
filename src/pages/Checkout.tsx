import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import PromoCodeForm from '@/components/PromoCodeForm';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { bookingApi } from '@/lib/api';
import { snowmobiles } from '@/data/snowmobiles';

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'card' | 'sbp' | 'yandex' | 'qiwi';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardHolder?: string;
  agreeToTerms: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Банковская карта',
    icon: 'CreditCard',
    description: 'Visa, MasterCard, МИР'
  },
  {
    id: 'sbp',
    name: 'СБП',
    icon: 'Smartphone',
    description: 'Система быстрых платежей'
  },
  {
    id: 'yandex',
    name: 'Яндекс.Деньги',
    icon: 'Wallet',
    description: 'Электронный кошелек'
  },
  {
    id: 'qiwi',
    name: 'QIWI',
    icon: 'Wallet',
    description: 'Электронный кошелек'
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  // Получаем данные из URL параметров
  const snowmobileId = parseInt(searchParams.get('snowmobileId') || '0');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const quantity = parseInt(searchParams.get('quantity') || '1');
  
  const snowmobile = snowmobiles.find(s => s.id === snowmobileId);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    defaultValues: {
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      paymentMethod: 'card',
      agreeToTerms: false
    }
  });

  const paymentMethod = watch('paymentMethod');
  const agreeToTerms = watch('agreeToTerms');

  // Проверяем наличие всех необходимых данных
  useEffect(() => {
    if (!snowmobile || !startDate || !endDate) {
      toast({
        title: 'Ошибка',
        description: 'Отсутствуют данные для оформления заказа',
        variant: 'destructive',
      });
      navigate('/catalog');
    }
  }, [snowmobile, startDate, endDate, navigate, toast]);

  // Заполняем данные пользователя, если он авторизован
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('customerName', user.name || '');
      setValue('customerEmail', user.email || '');
      setValue('customerPhone', user.phone || '');
    }
  }, [isAuthenticated, user, setValue]);

  if (!snowmobile || !startDate || !endDate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Icon name="AlertTriangle" className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ошибка</h2>
          <p className="text-gray-600 mb-4">Отсутствуют данные для оформления заказа</p>
          <Button onClick={() => navigate('/catalog')}>
            Вернуться к каталогу
          </Button>
        </div>
      </div>
    );
  }

  // Расчет стоимости
  const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const subtotal = snowmobile.pricePerDay * days * quantity;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = (amount: number, code: string) => {
    setDiscountAmount(amount);
    setAppliedPromoCode(code);
  };

  const handleRemoveDiscount = () => {
    setDiscountAmount(0);
    setAppliedPromoCode('');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!agreeToTerms) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо согласиться с условиями',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Создание бронирования после успешной оплаты
      const bookingData = {
        snowmobileId: snowmobile.id,
        startDate,
        endDate,
        quantity,
        customerInfo: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
        paymentInfo: {
          method: data.paymentMethod,
          amount: total,
          promoCode: appliedPromoCode || undefined,
          discountAmount: discountAmount || undefined
        }
      };

      if (import.meta.env.DEV) {
        // В режиме разработки эмулируем успешный платеж
        toast({
          title: 'Оплата успешна',
          description: 'Ваше бронирование оформлено и оплачено',
        });
        navigate('/profile');
      } else {
        // В продакшн-режиме отправляем реальный запрос
        const booking = await bookingApi.createBooking(bookingData);
        toast({
          title: 'Оплата успешна',
          description: `Бронирование #${booking.id} оформлено и оплачено`,
        });
        navigate('/profile');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Ошибка оплаты',
        description: 'Не удалось обработать платеж. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка - Детали заказа */}
          <div className="space-y-6">
            {/* Информация о снегоходе */}
            <Card>
              <CardHeader>
                <CardTitle>Детали бронирования</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img 
                    src={snowmobile.image} 
                    alt={snowmobile.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{snowmobile.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(startDate), 'dd.MM.yyyy', { locale: ru })} - {format(new Date(endDate), 'dd.MM.yyyy', { locale: ru })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} • {quantity} шт.
                    </p>
                    <p className="font-medium mt-2">
                      {snowmobile.pricePerDay.toLocaleString()} ₽/день
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Промокод */}
            <PromoCodeForm
              subtotal={subtotal}
              onApplyDiscount={handleApplyDiscount}
              onRemoveDiscount={handleRemoveDiscount}
            />

            {/* Итоговая стоимость */}
            <Card>
              <CardHeader>
                <CardTitle>Стоимость</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Аренда ({days} дн. × {quantity} шт.)</span>
                    <span>{subtotal.toLocaleString()} ₽</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка по промокоду</span>
                      <span>-{discountAmount.toLocaleString()} ₽</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>К оплате</span>
                    <span>{total.toLocaleString()} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - Форма оплаты */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Контактная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">ФИО</Label>
                    <Input
                      id="customerName"
                      placeholder="Введите ваше полное имя"
                      {...register('customerName', { required: 'Имя обязательно' })}
                      className={errors.customerName ? 'border-red-300' : ''}
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="example@mail.com"
                      {...register('customerEmail', { 
                        required: 'Email обязателен',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Некорректный email'
                        }
                      })}
                      className={errors.customerEmail ? 'border-red-300' : ''}
                    />
                    {errors.customerEmail && (
                      <p className="text-xs text-red-500 mt-1">{errors.customerEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Телефон</Label>
                    <Input
                      id="customerPhone"
                      placeholder="+7 (___) ___-__-__"
                      {...register('customerPhone', { 
                        required: 'Телефон обязателен',
                        pattern: {
                          value: /^(\+7|8)[\s(]?\d{3}[)\s]?[\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
                          message: 'Некорректный формат телефона'
                        }
                      })}
                      className={errors.customerPhone ? 'border-red-300' : ''}
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-500 mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Способ оплаты */}
              <Card>
                <CardHeader>
                  <CardTitle>Способ оплаты</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setValue('paymentMethod', value as any)}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Icon name={method.icon as any} className="h-5 w-5" />
                        <div className="flex-1">
                          <Label htmlFor={method.id} className="font-medium cursor-pointer">
                            {method.name}
                          </Label>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  {/* Поля для банковской карты */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Номер карты</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          {...register('cardNumber', { 
                            required: paymentMethod === 'card' ? 'Номер карты обязателен' : false 
                          })}
                          className={errors.cardNumber ? 'border-red-300' : ''}
                        />
                        {errors.cardNumber && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="cardExpiry">Срок действия</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            {...register('cardExpiry', { 
                              required: paymentMethod === 'card' ? 'Срок действия обязателен' : false 
                            })}
                            className={errors.cardExpiry ? 'border-red-300' : ''}
                          />
                          {errors.cardExpiry && (
                            <p className="text-xs text-red-500 mt-1">{errors.cardExpiry.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="123"
                            {...register('cardCvc', { 
                              required: paymentMethod === 'card' ? 'CVC обязателен' : false 
                            })}
                            className={errors.cardCvc ? 'border-red-300' : ''}
                          />
                          {errors.cardCvc && (
                            <p className="text-xs text-red-500 mt-1">{errors.cardCvc.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardHolder">Имя держателя карты</Label>
                        <Input
                          id="cardHolder"
                          placeholder="IVAN PETROV"
                          {...register('cardHolder', { 
                            required: paymentMethod === 'card' ? 'Имя держателя обязательно' : false 
                          })}
                          className={errors.cardHolder ? 'border-red-300' : ''}
                        />
                        {errors.cardHolder && (
                          <p className="text-xs text-red-500 mt-1">{errors.cardHolder.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Согласие с условиями */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
                  Я согласен с{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    условиями использования
                  </a>{' '}
                  и{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    политикой конфиденциальности
                  </a>
                </Label>
              </div>

              {/* Кнопка оплаты */}
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={isProcessing || !agreeToTerms}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Обработка платежа...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" className="mr-2 h-4 w-4" />
                    Оплатить {total.toLocaleString()} ₽
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;