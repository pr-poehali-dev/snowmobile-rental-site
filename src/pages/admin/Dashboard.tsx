
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { snowmobiles } from '@/data/snowmobiles';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSnowmobiles: 0,
    availableSnowmobiles: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    // В реальном приложении эти данные будут загружаться с сервера
    // Здесь используем моковые данные для демонстрации
    setStats({
      totalSnowmobiles: snowmobiles.length,
      availableSnowmobiles: snowmobiles.filter(s => s.available).length,
      totalOrders: 24, // Моковые данные
      totalRevenue: 156000, // Моковые данные
      recentOrders: [
        { id: 'ORD-001', customer: 'Иван Петров', date: '2025-05-01', amount: 15000, status: 'completed' },
        { id: 'ORD-002', customer: 'Анна Иванова', date: '2025-05-01', amount: 12000, status: 'pending' },
        { id: 'ORD-003', customer: 'Сергей Сидоров', date: '2025-04-30', amount: 22500, status: 'processing' },
        { id: 'ORD-004', customer: 'Елена Смирнова', date: '2025-04-29', amount: 9000, status: 'completed' },
      ]
    });
  }, []);

  // Определяем класс статуса для отображения
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Переводим статус на русский
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'pending':
        return 'Ожидание';
      case 'processing':
        return 'В обработке';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-gray-600">Обзор работы сервиса проката снегоходов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Всего снегоходов</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalSnowmobiles}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Snowflake" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Доступно для аренды</p>
                <h3 className="text-2xl font-bold mt-1">{stats.availableSnowmobiles}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="Check" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Всего заказов</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="ShoppingCart" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Общий доход</p>
                <h3 className="text-2xl font-bold mt-1">{stats.totalRevenue.toLocaleString()} ₽</h3>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="Banknote" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Клиент</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Дата</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Сумма</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4">{new Date(order.date).toLocaleDateString('ru-RU')}</td>
                      <td className="py-3 px-4 text-right">{order.amount.toLocaleString()} ₽</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Информация о снегоходах</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">В аренде</p>
                  <p className="text-xl font-bold mt-1">{stats.totalSnowmobiles - stats.availableSnowmobiles}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">На ремонте</p>
                  <p className="text-xl font-bold mt-1">2</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">По брендам</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Arctic Cat</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ski-Doo</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Yamaha</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Polaris</span>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
