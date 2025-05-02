
import { Snowmobile } from '@/types/snowmobile';

// Моковые данные для снегоходов
export const snowmobiles: Snowmobile[] = [
  {
    id: 1,
    name: 'Arctic Cat Bearcat 570',
    description: 'Надежный утилитарный снегоход с отличной проходимостью. Идеален для работы и отдыха. Arctic Cat Bearcat 570 — это снегоход, который отлично подходит для самых сложных заданий и длительных поездок. Его двухтактный двигатель отличается высокой надежностью и неприхотливостью в обслуживании.',
    price: 950000,
    pricePerDay: 5000,
    pricePerWeek: 30000,
    image: 'https://images.unsplash.com/photo-1612459284970-e8f84753d3b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '65 л.с.',
      weight: '290 кг',
      maxSpeed: '110 км/ч',
      fuelCapacity: '40 л',
      trackLength: '153"',
      trackWidth: '15"',
      suspension: 'FasTrack Long Travel'
    },
    category: 'utility',
    brand: 'Arctic Cat',
    available: true,
    features: ['Электростартер', 'Подогрев ручек и курка газа', 'Багажный отсек', 'Фаркоп']
  },
  {
    id: 2,
    name: 'Ski-Doo Expedition Sport',
    description: 'Многофункциональный снегоход для активного отдыха и путешествий. Комфортный и мощный. Модель Expedition Sport сочетает в себе возможности туристического и утилитарного снегохода. Он обеспечивает комфорт при длительных поездках и имеет хорошую грузоподъемность.',
    price: 1100000,
    pricePerDay: 6000,
    pricePerWeek: 36000,
    image: 'https://images.unsplash.com/photo-1518566585952-954bb14432d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '4-тактный',
      power: '95 л.с.',
      weight: '315 кг',
      maxSpeed: '130 км/ч',
      fuelCapacity: '45 л',
      trackLength: '154"',
      trackWidth: '16"',
      suspension: 'SC-5U'
    },
    category: 'touring',
    brand: 'Ski-Doo',
    available: true,
    features: ['Электростартер', 'Подогрев ручек и курка газа', 'Зеркала', 'Высокое ветровое стекло', 'Багажник']
  },
  {
    id: 3,
    name: 'Yamaha VK540',
    description: 'Классический утилитарный снегоход с высокой надежностью и отличной проходимостью. Yamaha VK540 — легендарная модель с проверенной временем конструкцией. Этот снегоход отлично справляется с перевозкой грузов и преодолением сложных участков.',
    price: 870000,
    pricePerDay: 4500,
    pricePerWeek: 27000,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '55 л.с.',
      weight: '310 кг',
      maxSpeed: '100 км/ч',
      fuelCapacity: '38 л',
      trackLength: '156"',
      trackWidth: '20"',
      suspension: 'ProComfort'
    },
    category: 'utility',
    brand: 'Yamaha',
    available: false,
    features: ['Электростартер', 'Подогрев ручек', 'Фаркоп', 'Карбюраторный двигатель']
  },
  {
    id: 4,
    name: 'Polaris RMK 850',
    description: 'Мощный горный снегоход для экстремального катания. Легкая управляемость и отличная маневренность в глубоком снегу. Создан для покорения самых крутых склонов и глубоких снежных покровов.',
    price: 1250000,
    pricePerDay: 7500,
    pricePerWeek: 45000,
    image: 'https://images.unsplash.com/photo-1547307874-4d5f28a3969e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '165 л.с.',
      weight: '210 кг',
      maxSpeed: '150 км/ч',
      fuelCapacity: '42 л',
      trackLength: '163"',
      trackWidth: '15"',
      suspension: 'PRO-RMK'
    },
    category: 'mountain',
    brand: 'Polaris',
    available: true,
    features: ['Электростартер', 'Подогрев ручек', 'Облегченная конструкция', 'Система впрыска масла']
  },
  {
    id: 5,
    name: 'Lynx Rave RE',
    description: 'Спортивный снегоход для трассового катания и гонок. Быстрый и маневренный, обеспечивает полный контроль на высоких скоростях. Идеален для любителей скоростной езды и адреналина.',
    price: 1050000,
    pricePerDay: 6500,
    pricePerWeek: 39000,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '145 л.с.',
      weight: '220 кг',
      maxSpeed: '170 км/ч',
      fuelCapacity: '39 л',
      trackLength: '137"',
      trackWidth: '15"',
      suspension: 'PPS2'
    },
    category: 'sport',
    brand: 'Lynx',
    available: true,
    features: ['Гоночная подвеска', 'Спортивные амортизаторы', 'Низкое ветровое стекло', 'Спортивное сиденье']
  },
  {
    id: 6,
    name: 'BRP Ski-Doo Tundra Xtreme',
    description: 'Снегоход для экстремального бездорожья и глубокого снега. Отличная проходимость и надежность в самых сложных условиях. Специально разработан для труднопроходимой местности и экстремальных условий.',
    price: 980000,
    pricePerDay: 6000,
    pricePerWeek: 36000,
    image: 'https://images.unsplash.com/photo-1607947909130-ddef342e1b2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '125 л.с.',
      weight: '230 кг',
      maxSpeed: '140 км/ч',
      fuelCapacity: '40 л',
      trackLength: '154"',
      trackWidth: '16"',
      suspension: 'REV-XU'
    },
    category: 'crossover',
    brand: 'Ski-Doo',
    available: true,
    features: ['Электростартер', 'Подогрев ручек и курка газа', 'Усиленная подвеска', 'Длинная гусеница']
  },
  {
    id: 7,
    name: 'Arctic Cat ZR 200',
    description: 'Детский снегоход для обучения и безопасного катания. Надежный и простой в управлении, с ограничением скорости. Идеален для детей, которые только начинают осваивать снегоходы.',
    price: 320000,
    pricePerDay: 2500,
    pricePerWeek: 15000,
    image: 'https://images.unsplash.com/photo-1516199423456-1f1e91b06f25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '4-тактный',
      power: '9 л.с.',
      weight: '120 кг',
      maxSpeed: '45 км/ч',
      fuelCapacity: '8 л',
      trackLength: '93"',
      trackWidth: '10"',
      suspension: 'Mini Slide-Action'
    },
    category: 'sport',
    brand: 'Arctic Cat',
    available: true,
    features: ['Родительский контроль скорости', 'Электростартер', 'Остановка двигателя при падении', 'Защитные элементы']
  },
  {
    id: 8,
    name: 'Yamaha Sidewinder L-TX',
    description: 'Мощный туристический снегоход для длительных поездок. Комфортный и быстрый, с передовыми технологиями. Обеспечивает максимальный комфорт во время многодневных путешествий.',
    price: 1350000,
    pricePerDay: 7000,
    pricePerWeek: 42000,
    image: 'https://images.unsplash.com/photo-1532876704999-928d11674a53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '4-тактный турбо',
      power: '200 л.с.',
      weight: '330 кг',
      maxSpeed: '180 км/ч',
      fuelCapacity: '48 л',
      trackLength: '137"',
      trackWidth: '15"',
      suspension: 'Dual Shock SR'
    },
    category: 'touring',
    brand: 'Yamaha',
    available: false,
    features: ['Электростартер', 'Подогрев сидений', 'Навигационная система', 'Аудиосистема', 'Задний багажник']
  }
];

// Получение уникальных брендов
export const getBrands = (): string[] => {
  return [...new Set(snowmobiles.map(item => item.brand))];
};

// Получение уникальных категорий
export const getCategories = (): string[] => {
  return [...new Set(snowmobiles.map(item => item.category))];
};

// Получение диапазона цен
export const getPriceRange = (): [number, number] => {
  const prices = snowmobiles.map(item => item.pricePerDay);
  return [Math.min(...prices), Math.max(...prices)];
};

// Фильтрация снегоходов
export const filterSnowmobiles = (
  items: Snowmobile[],
  filters: Filter,
  sortOption: SortOption
): Snowmobile[] => {
  let filtered = [...items];

  // Фильтрация по брендам
  if (filters.brands.length > 0) {
    filtered = filtered.filter(item => filters.brands.includes(item.brand));
  }

  // Фильтрация по категориям
  if (filters.categories.length > 0) {
    filtered = filtered.filter(item => filters.categories.includes(item.category));
  }

  // Фильтрация по доступности
  if (filters.availability !== null) {
    filtered = filtered.filter(item => item.available === filters.availability);
  }

  // Фильтрация по диапазону цен
  filtered = filtered.filter(
    item => item.pricePerDay >= filters.priceRange[0] && item.pricePerDay <= filters.priceRange[1]
  );

  // Сортировка
  filtered.sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.pricePerDay - b.pricePerDay;
      case 'price-desc':
        return b.pricePerDay - a.pricePerDay;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return filtered;
};

// Типы для фильтрации
export interface Filter {
  brands: string[];
  categories: string[];
  availability: boolean | null;
  priceRange: [number, number];
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// Категории
export const categories = {
  sport: {
    name: 'Спортивные',
    description: 'Легкие и быстрые снегоходы для спортивного катания и трасс'
  },
  utility: {
    name: 'Утилитарные',
    description: 'Надежные снегоходы для работы и перевозки грузов'
  },
  mountain: {
    name: 'Горные',
    description: 'Специализированные снегоходы для движения по глубокому снегу и склонам'
  },
  touring: {
    name: 'Туристические',
    description: 'Комфортные снегоходы для длительных поездок и путешествий'
  },
  crossover: {
    name: 'Кроссоверы',
    description: 'Универсальные снегоходы, сочетающие возможности разных типов'
  }
};
