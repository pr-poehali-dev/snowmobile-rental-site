import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { cartUtils } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';

interface BookingData {
  bookingNumber: string;
  name: string;
  email: string;
  phone: string;
  experienceLevel: string;
  additionalInfo?: string;
  emergencyContact?: string;
  items: Array<{
    id: string;
    snowmobile: {
      id: number;
      name: string;
      image: string;
      brand: string;
    };
    quantity: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    durationDays: number;
  }>;
  total: number;
  createdAt: string;
}

export default function BookingConfirmation() {
  const { bookingNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (location.state?.bookingData) {
      setBookingData(location.state.bookingData);
    } else {
      // Если данных нет в состоянии, перенаправляем на главную
      navigate('/');
    }
  }, [location.state, navigate]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Бронирование не найдено</h1>
          <p className="text-gray-600 mb-6">Данные о бронировании не найдены</p>
          <Button onClick={() => navigate('/')}>
            <Icon name="Home" size={16} className="mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Новичок';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Эксперт';
      default: return level;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // В реальном приложении здесь была бы генерация PDF
    alert('Функция генерации PDF будет доступна в ближайшее время');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок с успешным статусом */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Бронирование оформлено!
          </h1>
          <p className="text-gray-600 text-lg">
            Номер вашего бронирования: <span className="font-bold text-blue-600">{bookingNumber}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Детали бронирования */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Детали бронирования
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Номер бронирования</h4>
                    <p className="text-gray-600">{bookingData.bookingNumber}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Дата создания</h4>
                    <p className="text-gray-600">
                      {new Date(bookingData.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Статус</h4>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Ожидает подтверждения
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Опыт вождения</h4>
                    <p className="text-gray-600">{getExperienceLabel(bookingData.experienceLevel)}</p>
                  </div>
                </div>

                {bookingData.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Дополнительная информация</h4>
                    <p className="text-gray-600">{bookingData.additionalInfo}</p>
                  </div>
                )}

                {bookingData.emergencyContact && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Экстренный контакт</h4>
                    <p className="text-gray-600">{bookingData.emergencyContact}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Контактная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={20} />
                  Контактная информация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">ФИО</h4>
                    <p className="text-gray-600">{bookingData.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Телефон</h4>
                    <p className="text-gray-600">{bookingData.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{bookingData.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Заказанные снегоходы */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" size={20} />
                  Заказанные снегоходы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingData.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.snowmobile.image}
                          alt={item.snowmobile.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.snowmobile.name}
                        </h4>
                        <p className="text-sm text-gray-600">{item.snowmobile.brand}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Период:</span>
                            <span>
                              {cartUtils.formatDate(item.startDate)} - {cartUtils.formatDate(item.endDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Количество:</span>
                            <span>{item.quantity} шт.</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Дней:</span>
                            <span>{item.durationDays}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Стоимость:</span>
                            <span>{cartUtils.formatPrice(item.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Сводка и действия */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Receipt" size={20} />
                  Итоговая стоимость
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Позиций:</span>
                    <span>{bookingData.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Общее количество:</span>
                    <span>{bookingData.items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Итого:</span>
                  <span>{cartUtils.formatPrice(bookingData.total)}</span>
                </div>

                <div className="space-y-2">
                  <Button onClick={handlePrint} variant="outline" className="w-full">
                    <Icon name="Printer" size={16} className="mr-2" />
                    Распечатать
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" className="w-full">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать PDF
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button onClick={() => navigate('/catalog')} className="w-full">
                    <Icon name="Search" size={16} className="mr-2" />
                    Продолжить выбор
                  </Button>
                  <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                    <Icon name="Home" size={16} className="mr-2" />
                    На главную
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Дополнительная информация */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium text-blue-900 mb-2">Что дальше?</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• В течение 2 часов с вами свяжется менеджер для подтверждения</li>
                    <li>• За 24 часа до начала аренды вы получите SMS с деталями</li>
                    <li>• Документы для получения снегоходов будут отправлены на email</li>
                    <li>• При себе иметь: паспорт, водительские права (категория А)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}