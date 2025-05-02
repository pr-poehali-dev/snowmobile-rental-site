
export interface Snowmobile {
  id: number;
  name: string;
  description: string;
  price: number;
  pricePerDay: number;
  pricePerWeek: number;
  image: string;
  specifications: {
    engineType: string;
    power: string;
    weight: string;
    maxSpeed: string;
    fuelCapacity: string;
    trackLength?: string;
    trackWidth?: string;
    suspension?: string;
  };
  category: 'sport' | 'utility' | 'mountain' | 'touring' | 'crossover';
  brand: string;
  available: boolean;
  features?: string[];
}

export interface CartItem {
  snowmobile: Snowmobile;
  quantity: number;
  rentalDays: number;
  startDate?: Date;
  endDate?: Date;
}

export interface Filter {
  brands: string[];
  categories: string[];
  availability: boolean | null;
  priceRange: [number, number];
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
