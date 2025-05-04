
import { useState, useEffect } from 'react';
import { addDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Icon from '@/components/ui/icon';

// Моковые данные для статистики
const generateBookingStats = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, -30 + i);
    data.push({
      date: format(date, 'dd.MM'),
      bookings: Math.floor(Math.random() * 10),
      revenue: Math.floor(Math.random() * 50000 + 5000),
    });
  }
  
  return data;
};

const getCategoryStats = () => [
  { name: 'Спортивные', value: 35 },
  { name: 'Утилитарные', value: 25 },
  { name: 'Горные', value: 20 },
  { name: 'Туристические', value: 15 },
  { name: 'Кроссоверы', value: 5 },
];

const getTopSnowmobiles = () => [
  { name: 'Arctic Cat Riot', bookings: 42, revenue: 168000 },
  { name: 'Yamaha Sidewinder', bookings: 38, revenue: 152000 },
  { name: 'Polaris RMK 850', bookings: 35, revenue: 140000 },
  { name: 'BRP Ski-Doo Summit', bookings: 30, revenue: 120000 },
  { name: 'Lynx Xtrim', bookings: 25, revenue: 100000 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const Statistics = () => {
  const [periodType, setPeriodType] = useState('month');
  const [bookingStats, setBookingStats] = useState(generateBookingStats());
  const [categoryStats, setCategoryStats] = useState(getCategoryStats());
  const [topSnowmobiles, setTopSnowmobiles] = useState(getTopSnowmobiles());
  const [loading, setLoading] = useState(false);
  
  // Обработчик изменения периода
  const handlePeriodChange = (value: string) => {
    setPeriodType(value);
    setLoading(true);
    
    // Имитация загрузки данных
    setTimeout(() => {
      setBookingStats(generateBookingStats());
      setLoading(false);
    }, 800);
  };
  
  // Расчет общей статистики
  const calculateTotals = () => {
    return bookingStats.reduce((acc, item) => ({
      bookings: acc.bookings + item.bookings,
      revenue: acc.revenue + item.revenue,
    }), { bookings: 0, revenue: 0 });
  };
  
  const totals = calculateTotals();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Статистика и аналитика</h1>
        
        <div className="w-48">
          <Select defaultValue={periodType} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Карточки с общей статистикой */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Всего бронирований</CardDescription>
            <CardTitle className="text-3xl">{totals.bookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Icon name="TrendingUp" className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+12%</span>
              <span className="ml-1">по сравнению с предыдущим периодом</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Выручка</CardDescription>
            <CardTitle className="text-3xl">{totals.revenue.toLocaleString()} ₽</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Icon name="TrendingUp" className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+8%</span>
              <span className="ml-1">по сравнению с предыдущим периодом</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Средний чек</CardDescription>
            <CardTitle className="text-3xl">
              {totals.bookings > 0 
                ? Math.round(totals.revenue / totals.bookings).toLocaleString() 
                : 0} ₽
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Icon name="TrendingDown" className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">-2%</span>
              <span className="ml-1">по сравнению с предыдущим периодом</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Графики и диаграммы */}
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="top">Топ снегоходов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Динамика бронирований</CardTitle>
              <CardDescription>
                График бронирований и выручки за {periodType === 'week' ? 'неделю' : periodType === 'month' ? 'месяц' : periodType === 'quarter' ? 'квартал' : 'год'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <Icon name="Loader2" className="mr-2 h-6 w-6 animate-spin" />
                  <span>Загрузка данных...</span>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={bookingStats}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Выручка, ₽"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        yAxisId="right"
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        name="Бронирования, шт"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorBookings)"
                        yAxisId="left"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по категориям</CardTitle>
              <CardDescription>
                Диаграмма популярности различных категорий снегоходов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Доля бронирований']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="top" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Топ-5 снегоходов</CardTitle>
              <CardDescription>
                Самые популярные модели по количеству бронирований
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSnowmobiles}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" name="Бронирования" fill="#8884d8" />
                    <Bar dataKey="revenue" name="Выручка, ₽" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
