
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
  };
  available: boolean;
}

export interface CartItem {
  snowmobile: Snowmobile;
  quantity: number;
  rentalDays: number;
}
