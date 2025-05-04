
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/booking/BookingForm';
import { useToast } from '@/hooks/use-toast';
import { snowmobileApi } from '@/lib/api';
import { Snowmobile } from '@/types/snowmobile';

const SnowmobileDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [snowmobile, setSnowmobile] = useState<Snowmobile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Загрузка данных о снегоходе
  useEffect(() => {
    const fetchSnowmobile = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const snowmobileId = parseInt(id);
        const data = await snowmobileApi.getSnowmobileById(snowmobileId);
        setSnowmobile(data);
        // Установка первого изображения как активного
        if (data.image) {
          setActiveImage(data.image);
        }
      } catch (error) {
        console.error('Error fetching snowmobile:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить информацию о снегоходе',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSnowmobile();
  }, [id, toast]);
  
  // Получение дополнительных изображений (в реальном приложении будет API)
  const getAdditionalImages = (): string[] => {
    // В реальном приложении здесь будет запрос за дополнительными изображениями
    // Для демо используем заглушки с Unsplash
    return [
      snowmobile?.image || 'https://images.unsplash.com/photo-1605007493699-af65608c4a05?w=800&q=80',
      'https://images.unsplash.com/photo-1542317869-802ce6866e78?w=800&q=80',
      'https://images.unsplash.com/photo-1612549559710-0d5d1b1b0b0a?w=800&q=80',
      'https://images.unsplash.com/photo-1578307980242-df3167d9e397?w=800&q=80',
    ];
  };
  
  // Получение категории для отображения
  const getCategoryLabel = (category: Snowmobile['category']) => {
    const categories = {
      'sport': 'Спортивный',
      'utility': 'Утилитарный',
      'mountain': 'Горный',
      'touring': 'Туристический',
      'crossover': 'Кроссовер',
    };
    return categories[category] || category;
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center py-16">
            <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
            <span>Загрузка информации о снегоходе...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!snowmobile) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16">
            <Icon name="AlertTriangle" className="mx-auto h-10 w-10 text-yellow-500" />
            <h2 className="mt-4 text-xl font-semibold">Снегоход не найден</h2>
            <p className="mt-2 text-gray-600">
              Запрашиваемый снегоход не существует или был удален
            </p>
            <Button onClick={() => navigate('/catalog')} className="mt-4">
              Вернуться к каталогу
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  const images = getAdditionalImages();
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center text-sm mb-6">
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/')}>
            Главная
          </Button>
          <Icon name="ChevronRight" className="h-4 w-4 mx-1" />
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/catalog')}>
            Каталог
          </Button>
          <Icon name="ChevronRight" className="h-4 w-4 mx-1" />
          <span className="text-gray-500">{snowmobile.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Левая колонка (изображения и информация) */}
          <div>
            {/* Галерея изображений */}
            <div className="mb-6">
              <div className="aspect-video overflow-hidden rounded-lg mb-4">
                <img
                  src={activeImage}
                  alt={snowmobile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden transition ${
                      activeImage === img ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${snowmobile.name} вид ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Основные характеристики */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="specifications">Характеристики</TabsTrigger>
                <TabsTrigger value="features">Особенности</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="py-4">
                <div className="prose max-w-none">
                  <p>{snowmobile.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Двигатель</span>
                      <span className="font-medium">{snowmobile.specifications.engineType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Мощность</span>
                      <span className="font-medium">{snowmobile.specifications.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Вес</span>
                      <span className="font-medium">{snowmobile.specifications.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Макс. скорость</span>
                      <span className="font-medium">{snowmobile.specifications.maxSpeed}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Объем бака</span>
                      <span className="font-medium">{snowmobile.specifications.fuelCapacity}</span>
                    </div>
                    {snowmobile.specifications.trackLength && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Длина гусеницы</span>
                        <span className="font-medium">{snowmobile.specifications.trackLength}</span>
                      </div>
                    )}
                    {snowmobile.specifications.trackWidth && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ширина гусеницы</span>
                        <span className="font-medium">{snowmobile.specifications.trackWidth}</span>
                      </div>
                    )}
                    {snowmobile.specifications.suspension && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Подвеска</span>
                        <span className="font-medium">{snowmobile.specifications.suspension}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="py-4">
                {snowmobile.features && snowmobile.features.length > 0 ? (
                  <ul className="space-y-2">
                    {snowmobile.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Icon name="Check" className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Особенности не указаны</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка (цена и бронирование) */}
          <div className="space-y-6">
            {/* Заголовок и цена */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{snowmobile.name}</h1>
                <Badge variant="outline">{getCategoryLabel(snowmobile.category)}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Производитель:</span>
                <span className="font-medium">{snowmobile.brand}</span>
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-primary">
                {snowmobile.pricePerDay.toLocaleString()} ₽
                <span className="text-sm text-gray-500 font-normal ml-1">/ день</span>
              </div>
              {snowmobile.pricePerWeek && (
                <div className="text-sm text-gray-500 mt-1">
                  {snowmobile.pricePerWeek.toLocaleString()} ₽ / неделя
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={snowmobile.available ? 'outline' : 'secondary'} className={snowmobile.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {snowmobile.available ? 'В наличии' : 'Нет в наличии'}
              </Badge>
              <span className="text-sm text-gray-500">ID: {snowmobile.id}</span>
            </div>
            
            <Separator />
            
            {/* Форма бронирования */}
            {snowmobile.available ? (
              <BookingForm snowmobile={snowmobile} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-6">
                    <Icon name="AlertCircle" className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">Снегоход недоступен для бронирования</h3>
                    <p className="mt-2 text-gray-500">
                      К сожалению, этот снегоход временно недоступен. Пожалуйста, выберите другую модель или подпишитесь на уведомления о доступности.
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/catalog')}>
                      Смотреть другие модели
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Рекомендуемые снегоходы (заглушка для примера) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Вам также может понравиться</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Здесь будут карточки рекомендуемых снегоходов */}
            <div className="text-center py-8">
              <p className="text-gray-500">Загрузка рекомендаций...</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SnowmobileDetailPage;
