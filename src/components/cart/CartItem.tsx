import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart, cartUtils } from '@/hooks/use-cart';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CartItemProps {
  item: {
    id: string;
    snowmobile: {
      id: number;
      name: string;
      image: string;
      pricePerDay: number;
      brand: string;
    };
    quantity: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    durationDays: number;
  };
  onUpdate?: () => void;
}

export default function CartItem({ item, onUpdate }: CartItemProps) {
  const { updateQuantity, removeItem, updateItem } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editDates, setEditDates] = useState({
    startDate: item.startDate,
    endDate: item.endDate,
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
      onUpdate?.();
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
    onUpdate?.();
  };

  const handleDateUpdate = () => {
    const newDurationDays = cartUtils.calculateDurationDays(
      editDates.startDate,
      editDates.endDate
    );
    const newTotalPrice = cartUtils.calculateTotalPrice(
      item.snowmobile,
      item.quantity,
      newDurationDays
    );

    updateItem(item.id, {
      startDate: editDates.startDate,
      endDate: editDates.endDate,
      durationDays: newDurationDays,
      totalPrice: newTotalPrice,
    });

    setIsEditing(false);
    onUpdate?.();
  };

  const cancelEdit = () => {
    setEditDates({
      startDate: item.startDate,
      endDate: item.endDate,
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Изображение снегохода */}
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={item.snowmobile.image}
            alt={item.snowmobile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Основная информация */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg truncate">
                {item.snowmobile.name}
              </h3>
              <p className="text-sm text-gray-600">{item.snowmobile.brand}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>

          {/* Даты аренды */}
          <div className="space-y-2 mb-3">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 block mb-1">
                      Дата начала
                    </label>
                    <Input
                      type="date"
                      value={editDates.startDate}
                      onChange={(e) =>
                        setEditDates({
                          ...editDates,
                          startDate: e.target.value,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 block mb-1">
                      Дата окончания
                    </label>
                    <Input
                      type="date"
                      value={editDates.endDate}
                      onChange={(e) =>
                        setEditDates({
                          ...editDates,
                          endDate: e.target.value,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleDateUpdate}
                    className="flex-1"
                  >
                    <Icon name="Check" size={14} className="mr-1" />
                    Сохранить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEdit}
                    className="flex-1"
                  >
                    <Icon name="X" size={14} className="mr-1" />
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="Calendar" size={14} />
                  <span>
                    {cartUtils.formatDate(item.startDate)} -{' '}
                    {cartUtils.formatDate(item.endDate)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="ml-2 h-6 px-2 text-xs"
                  >
                    <Icon name="Edit2" size={12} className="mr-1" />
                    Изменить
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  {item.durationDays} {item.durationDays === 1 ? 'день' : 
                   item.durationDays < 5 ? 'дня' : 'дней'}
                </p>
              </div>
            )}
          </div>

          {/* Количество и цена */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Количество:</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                {cartUtils.formatPrice(item.snowmobile.pricePerDay)} / день
              </p>
              <p className="font-semibold text-lg">
                {cartUtils.formatPrice(item.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}