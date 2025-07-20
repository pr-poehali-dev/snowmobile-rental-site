import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Snowmobile } from '@/types/snowmobile';

interface CartItem {
  id: string;
  snowmobile: Snowmobile;
  quantity: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  durationDays: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<CartItem> } };

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Обновляем существующий элемент
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Добавляем новый элемент
        newItems = [...state.items, action.payload];
      }

      const total = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: action.payload.quantity,
              totalPrice: (item.totalPrice / item.quantity) * action.payload.quantity,
            }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_ITEM': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  isItemInCart: (id: string) => boolean;
  getItem: (id: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isItemInCart = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  const getItem = (id: string) => {
    return state.items.find(item => item.id === id);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateItem,
    clearCart,
    isItemInCart,
    getItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Утилитарные функции для работы с корзиной
export const cartUtils = {
  // Создание уникального ID для элемента корзины
  createCartItemId: (snowmobileId: number, startDate: string, endDate: string) => {
    return `${snowmobileId}-${startDate}-${endDate}`;
  },

  // Расчет количества дней аренды
  calculateDurationDays: (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  },

  // Расчет общей стоимости
  calculateTotalPrice: (snowmobile: Snowmobile, quantity: number, durationDays: number) => {
    return snowmobile.pricePerDay * quantity * durationDays;
  },

  // Создание элемента корзины
  createCartItem: (
    snowmobile: Snowmobile,
    quantity: number,
    startDate: string,
    endDate: string
  ): CartItem => {
    const durationDays = cartUtils.calculateDurationDays(startDate, endDate);
    const totalPrice = cartUtils.calculateTotalPrice(snowmobile, quantity, durationDays);
    const id = cartUtils.createCartItemId(snowmobile.id, startDate, endDate);

    return {
      id,
      snowmobile,
      quantity,
      startDate,
      endDate,
      totalPrice,
      durationDays,
    };
  },

  // Форматирование цены
  formatPrice: (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  },

  // Форматирование даты
  formatDate: (dateString: string) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  },
};

export default useCart;