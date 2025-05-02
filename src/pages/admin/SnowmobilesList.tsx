
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { snowmobiles } from '@/data/snowmobiles';
import { Snowmobile } from '@/types/snowmobile';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SnowmobilesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Фильтрация снегоходов
  const filteredSnowmobiles = snowmobiles.filter(snowmobile => {
    const matchesSearch = 
      snowmobile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snowmobile.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snowmobile.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'available') return matchesSearch && snowmobile.available;
    if (statusFilter === 'unavailable') return matchesSearch && !snowmobile.available;
    
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Управление снегоходами</h1>
          <p className="text-gray-600">Добавление, редактирование и удаление снегоходов</p>
        </div>
        <Button>
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить снегоход
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Поиск по названию, бренду..."
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
                  <SelectItem value="all">Все снегоходы</SelectItem>
                  <SelectItem value="available">Доступные</SelectItem>
                  <SelectItem value="unavailable">Недоступные</SelectItem>
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
                  <TableHead className="min-w-[250px]">Название</TableHead>
                  <TableHead>Бренд</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена/день</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSnowmobiles.map((snowmobile) => (
                  <TableRow key={snowmobile.id}>
                    <TableCell className="font-medium">{snowmobile.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                          <img 
                            src={snowmobile.image} 
                            alt={snowmobile.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium truncate max-w-[180px]">
                          {snowmobile.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{snowmobile.brand}</TableCell>
                    <TableCell>
                      <span className="capitalize">{snowmobile.category}</span>
                    </TableCell>
                    <TableCell>{snowmobile.pricePerDay.toLocaleString()} ₽</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        snowmobile.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {snowmobile.available ? 'Доступен' : 'Недоступен'}
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
                            <Icon name="Edit" size={14} className="mr-2" />
                            <span>Редактировать</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icon name="Eye" size={14} className="mr-2" />
                            <span>Просмотр</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Icon name="Trash" size={14} className="mr-2" />
                            <span>Удалить</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredSnowmobiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Icon name="SearchX" size={24} className="mb-2" />
                        <p>Снегоходы не найдены</p>
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

export default SnowmobilesList;
