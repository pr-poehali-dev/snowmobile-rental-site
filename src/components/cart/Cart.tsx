import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useCart, cartUtils } from '@/hooks/use-cart';
import CartItem from './CartItem';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking?: () => void;
}

export default function Cart({ isOpen, onClose, onProceedToBooking }: CartProps) {
  const { state, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleProceedToBooking = () => {
    onProceedToBooking?.();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={20} />
              Корзина
              {state.itemCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {state.itemCount}
                </Badge>
              )}
            </SheetTitle>
            {state.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="Trash2" size={16} className="mr-1" />
                Очистить
              </Button>
            )}
          </div>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="ShoppingCart" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Корзина пуста
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Добавьте снегоходы в корзину, чтобы оформить бронирование
            </p>
            <Button onClick={onClose} variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Продолжить выбор
            </Button>
          </div>
        ) : (
          <>
            {/* Список товаров */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {state.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={() => {
                    // Можно добавить дополнительную логику при обновлении
                  }}
                />
              ))}
            </div>

            {/* Итоговая информация и кнопки */}
            <div className="border-t pt-4 space-y-4">
              {/* Сводка по заказу */}
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Количество позиций:</span>
                    <span>{state.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Общее количество:</span>
                    <span>{state.itemCount} шт.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Общий период:</span>
                    <span>
                      {Math.min(...state.items.map(item => 
                        new Date(item.startDate).getTime()
                      )) && Math.max(...state.items.map(item => 
                        new Date(item.endDate).getTime()
                      )) ? (
                        <>
                          {cartUtils.formatDate(
                            new Date(Math.min(...state.items.map(item => 
                              new Date(item.startDate).getTime()
                            ))).toISOString().split('T')[0]
                          )} - {cartUtils.formatDate(
                            new Date(Math.max(...state.items.map(item => 
                              new Date(item.endDate).getTime()
                            ))).toISOString().split('T')[0]
                          )}
                        </>
                      ) : 'Не определен'}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Итого:</span>
                    <span className="font-bold text-lg">
                      {cartUtils.formatPrice(state.total)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Кнопки действий */}
              <div className="space-y-2">
                <Button
                  onClick={handleProceedToBooking}
                  className="w-full"
                  size="lg"
                >
                  <Icon name="Calendar" size={18} className="mr-2" />
                  Оформить бронирование
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Продолжить выбор
                </Button>
              </div>

              {/* Дополнительная информация */}
              <div className="text-xs text-gray-500 text-center">
                <p>
                  <Icon name="Info" size={12} className="inline mr-1" />
                  Бронирование действительно в течение 24 часов
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}