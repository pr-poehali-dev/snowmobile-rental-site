import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/use-cart';
import CartBookingForm from '@/components/booking/CartBookingForm';
import { useEffect } from 'react';

export default function CartBooking() {
  const navigate = useNavigate();
  const { state } = useCart();

  // Перенаправляем на главную, если корзина пуста
  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/catalog');
    }
  }, [state.items.length, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="ShoppingCart" size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Корзина пуста</h1>
          <p className="text-gray-600 mb-6">Добавьте снегоходы в корзину для оформления бронирования</p>
          <Button onClick={() => navigate('/catalog')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Перейти к каталогу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <CartBookingForm onBack={handleBack} />
      </div>
    </div>
  );
}