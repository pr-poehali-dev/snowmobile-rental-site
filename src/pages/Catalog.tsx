
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SnowmobileCard from '@/components/SnowmobileCard';
import { snowmobiles, getBrands, getCategories, getPriceRange, filterSnowmobiles, categories } from '@/data/snowmobiles';
import { Snowmobile, Filter, SortOption } from '@/types/snowmobile';

const Catalog = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Получаем параметры из URL
  const getInitialFilters = (): Filter => {
    return {
      brands: searchParams.getAll('brand'),
      categories: searchParams.getAll('category'),
      availability: searchParams.has('available') 
        ? searchParams.get('available') === 'true' 
        : null,
      priceRange: [
        parseInt(searchParams.get('minPrice') || '0'),
        parseInt(searchParams.get('maxPrice') || '10000')
      ]
    };
  };
  
  // Состояния
  const [allSnowmobiles, setAllSnowmobiles] = useState<Snowmobile[]>(snowmobiles);
  const [filteredSnowmobiles, setFilteredSnowmobiles] = useState<Snowmobile[]>([]);
  const [filters, setFilters] = useState<Filter>(getInitialFilters());
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'price-asc'
  );
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [loading, setLoading] = useState(false);
  
  // Константы для пагинации
  const itemsPerPage = 6;
  const availableBrands = getBrands();
  const availableCategories = getCategories();
  const [minPrice, maxPrice] = getPriceRange();
  
  // Обновление URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    filters.brands.forEach(brand => params.append('brand', brand));
    filters.categories.forEach(category => params.append('category', category));
    if (filters.availability !== null) params.set('available', String(filters.availability));
    params.set('minPrice', String(filters.priceRange[0]));
    params.set('maxPrice', String(filters.priceRange[1]));
    params.set('sort', sortOption);
    params.set('page', String(page));
    
    setSearchParams(params);
  }, [filters, search, sortOption, page, setSearchParams]);
  
  // Применение фильтров к снегоходам
  useEffect(() => {
    setLoading(true);
    
    // Имитация задержки загрузки
    setTimeout(() => {
      // Фильтруем сначала по поисковому запросу
      let results = allSnowmobiles;
      
      if (search) {
        const searchLower = search.toLowerCase();
        results = results.filter(
          s => s.name.toLowerCase().includes(searchLower) || 
               s.description.toLowerCase().includes(searchLower) ||
               s.brand.toLowerCase().includes(searchLower) ||
               s.category.toLowerCase().includes(searchLower)
        );
      }
      
      // Затем применяем остальные фильтры
      const filtered = filterSnowmobiles(results, filters, sortOption);
      setFilteredSnowmobiles(filtered);
      
      // Если текущая страница выходит за пределы результатов, сбрасываем на первую
      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      if (page > totalPages && totalPages > 0) {
        setPage(1);
      }
      
      setLoading(false);
    }, 300); // Небольшая задержка для демонстрации загрузки
    
  }, [allSnowmobiles, filters, search, sortOption, page]);
  
  // Обработчик изменения бренда
  const handleBrandChange = (brand: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return { ...prev, brands: [...prev.brands, brand] };
      } else {
        return { ...prev, brands: prev.brands.filter(b => b !== brand) };
      }
    });
    setPage(1);
  };
  
  // Обработчик изменения категории
  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return { ...prev, categories: [...prev.categories, category] };
      } else {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      }
    });
    setPage(1);
  };
  
  // Обработчик изменения доступности
  const handleAvailabilityChange = (value: string) => {
    if (value === 'all') {
      setFilters(prev => ({ ...prev, availability: null }));
    } else {
      setFilters(prev => ({ ...prev, availability: value === 'available' }));
    }
    setPage(1);
  };
  
  // Обработчик изменения диапазона цен
  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
    setPage(1);
  };
  
  // Обработчик сброса фильтров
  const handleResetFilters = () => {
    setFilters({
      brands: [],
      categories: [],
      availability: null,
      priceRange: [minPrice, maxPrice]
    });
    setSearch('');
    setSortOption('price-asc');
    setPage(1);
  };
  
  // Получение текущей страницы элементов
  const getCurrentPageItems = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSnowmobiles.slice(startIndex, endIndex);
  };
  
  // Расчет общего количества страниц
  const totalPages = Math.ceil(filteredSnowmobiles.length / itemsPerPage);
  
  // Генерация номеров страниц для пагинации
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setPage(i)} 
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Каталог снегоходов</h1>
        <p className="text-gray-500 mb-6">Выберите подходящую модель для катания или аренды</p>
        
        {/* Строка поиска и сортировки */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Поиск снегоходов..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">По цене (возрастание)</SelectItem>
                <SelectItem value="price-desc">По цене (убывание)</SelectItem>
                <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                <SelectItem value="name-desc">По названию (Я-А)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="md:hidden"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            >
              <Icon name="SlidersHorizontal" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры */}
          <Card className={`lg:block ${isFiltersVisible ? 'block' : 'hidden'}`}>
            <CardHeader>
              <CardTitle>Фильтры</CardTitle>
              <CardDescription>Настройте параметры поиска</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Фильтр по доступности */}
              <div>
                <h3 className="text-sm font-medium mb-3">Доступность</h3>
                <Select 
                  value={filters.availability === null ? 'all' : filters.availability ? 'available' : 'unavailable'}
                  onValueChange={handleAvailabilityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Доступность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все снегоходы</SelectItem>
                    <SelectItem value="available">В наличии</SelectItem>
                    <SelectItem value="unavailable">Нет в наличии</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Фильтр по бренду */}
              <div>
                <h3 className="text-sm font-medium mb-3">Бренд</h3>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox 
                        id={`brand-${brand}`} 
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={(checked) => 
                          handleBrandChange(brand, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Фильтр по категории */}
              <div>
                <h3 className="text-sm font-medium mb-3">Категория</h3>
                <div className="space-y-2">
                  {Object.entries(categories).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <Checkbox 
                        id={`category-${key}`} 
                        checked={filters.categories.includes(key)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(key, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`category-${key}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {value.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Фильтр по цене */}
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Цена за день</h3>
                  <span className="text-sm text-gray-500">
                    {filters.priceRange[0].toLocaleString()}₽ - {filters.priceRange[1].toLocaleString()}₽
                  </span>
                </div>
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleResetFilters}>
                Сбросить фильтры
              </Button>
            </CardFooter>
          </Card>
          
          {/* Результаты */}
          <div className="lg:col-span-3">
            {/* Информация о результатах */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-500">
                  Найдено: <strong>{filteredSnowmobiles.length}</strong> снегоходов
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {Object.entries(filters).some((
                  [key, value]) => 
                    (Array.isArray(value) && value.length > 0) || 
                    (key === 'availability' && value !== null) ||
                    (key === 'priceRange' && (
                      value[0] !== minPrice || value[1] !== maxPrice
                    ))
                ) && (
                  <Badge variant="outline" className="px-2 py-1">
                    Применены фильтры
                    <button 
                      onClick={handleResetFilters}
                      className="ml-2 hover:text-primary"
                    >
                      <Icon name="X" className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Загрузка */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                <span>Загрузка снегоходов...</span>
              </div>
            ) : filteredSnowmobiles.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <Icon name="Search" className="mx-auto h-10 w-10 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">Снегоходы не найдены</h3>
                <p className="mt-2 text-gray-500">
                  По вашему запросу не найдено ни одного снегохода. Попробуйте изменить параметры поиска.
                </p>
                <Button 
                  onClick={handleResetFilters}
                  className="mt-4"
                >
                  Сбросить все фильтры
                </Button>
              </div>
            ) : (
              <>
                {/* Сетка снегоходов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {getCurrentPageItems().map((snowmobile) => (
                    <SnowmobileCard 
                      key={snowmobile.id} 
                      snowmobile={snowmobile}
                      onClick={() => navigate(`/snowmobile/${snowmobile.id}`)}
                    />
                  ))}
                </div>
                
                {/* Пагинация */}
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPage(prev => Math.max(1, prev - 1))}
                          disabled={page === 1}
                        />
                      </PaginationItem>
                      
                      {generatePaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={page === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalog;
