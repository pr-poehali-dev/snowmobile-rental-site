
import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Моковые данные для заказов
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'Иван Петров',
      email: 'ivan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    snowmobile: 'Arctic Cat Bearcat 570',
    date: '2025-05-01',
    startDate: '2025-05-05',
    endDate: '2025-05-08',
    amount: 15000,
    status: 'completed'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Анна Иванова',
      email: 'anna@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    snowmobile: 'Ski-Doo Expedition Sport',
    date: '2025-05-01',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    amount: 12000,
    status: 'pending'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Сергей Сидоров',
      email: 'sergey@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    snowmobile: 'Yamaha VK540',
    date: '2025-04-30',
    startDate: '2025-05-15',
    endDate: '2025-05-20',
    amount: 22500,
    status: 'processing'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Елена Смирнова',
      email: 'elena@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    snowmobile: 'Polaris RMK 850',
    date: '2025-04-29',
    startDate: '2025-05-01',
    endDate: '2025-05-02',
    amount: 9000,
    status: 'completed'
  },
  {
    id: 'ORD-005',
    customer: {
      name: 'Михаил Козлов',
      email: 'mikhail@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    snowmobile: 'Lynx Rave RE',
    date: '2025-04-28',
    startDate: '2025-05-03',
    endDate: '2025-05-06',
    amount: 18000,
    status: 'cancelled'
  }
];

const OrdersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Фильтрация заказов
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.snowmobile.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  // Определяем класс статуса для отображения
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
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
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление заказами</h1>
          <p className="text-gray-600">Просмотр и обработка заказов клиентов</p>
        </div>
        <Button>
          <Icon name="FileText" size={16} className="mr-2" />
          Экспорт
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Поиск по клиенту, снегоходу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все заказы</SelectItem>
                  <SelectItem value="pending">Ожидание</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="cancelled">Отмененные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[180px]">Клиент</TableHead>
                  <TableHead>Снегоход</TableHead>
                  <TableHead>Период аренды</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                          <img 
                            src={order.customer.avatar} 
                            alt={order.customer.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.snowmobile}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.startDate).toLocaleDateString('ru-RU')} - {new Date(order.endDate).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} дней
                      </div>
                    </TableCell>
                    <TableCell>{order.amount.toLocaleString()} ₽</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Icon name="MoreVertical" size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Icon name="Eye" size={14} className="mr-2" />
                            <span>Подробности</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icon name="Edit" size={14} className="mr-2" />
                            <span>Изменить статус</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icon name="Printer" size={14} className="mr-2" />
                            <span>Печать</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Icon name="SearchX" size={24} className="mb-2" />
                        <p>Заказы не найдены</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersList;
