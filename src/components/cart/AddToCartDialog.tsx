import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useCart, cartUtils } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Snowmobile } from '@/types/snowmobile';

interface AddToCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  snowmobile: Snowmobile;
}

export default function AddToCartDialog({ isOpen, onClose, snowmobile }: AddToCartDialogProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Получаем минимальную дату (сегодня)
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите даты аренды',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: 'Ошибка',
        description: 'Дата начала не может быть позже даты окончания',
        variant: 'destructive',
      });
      return;
    }

    // Создаем элемент корзины
    const cartItem = cartUtils.createCartItem(snowmobile, quantity, startDate, endDate);

    // Добавляем в корзину
    addItem(cartItem);

    toast({
      title: 'Добавлено в корзину!',
      description: `${snowmobile.name} добавлен в корзину`,
    });

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setQuantity(1);
    setStartDate('');
    setEndDate('');
  };

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const durationDays = cartUtils.calculateDurationDays(startDate, endDate);
    return cartUtils.calculateTotalPrice(snowmobile, quantity, durationDays);
  };

  const getDurationDays = () => {
    if (!startDate || !endDate) return 0;
    return cartUtils.calculateDurationDays(startDate, endDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={20} />
            Добавить в корзину
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Информация о снегоходе */}
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={snowmobile.image}
                alt={snowmobile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{snowmobile.name}</h3>
              <p className="text-xs text-gray-600">{snowmobile.brand}</p>
              <p className="text-sm font-medium text-blue-600 mt-1">
                {cartUtils.formatPrice(snowmobile.pricePerDay)}/день
              </p>
            </div>
          </div>

          {/* Количество */}
          <div>
            <Label htmlFor="quantity">Количество</Label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
              <SelectTrigger id="quantity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'снегоход' : num < 5 ? 'снегохода' : 'снегоходов'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Даты аренды */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Дата окончания</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Расчет стоимости */}
          {startDate && endDate && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Расчет стоимости:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Количество:</span>
                  <span>{quantity} шт.</span>
                </div>
                <div className="flex justify-between">
                  <span>Дней аренды:</span>
                  <span>{getDurationDays()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Цена за день:</span>
                  <span>{cartUtils.formatPrice(snowmobile.pricePerDay)}</span>
                </div>
                <Separator className="my-2 bg-blue-200" />
                <div className="flex justify-between font-medium text-base text-blue-900">
                  <span>Итого:</span>
                  <span>{cartUtils.formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <Icon name="X" size={16} className="mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!startDate || !endDate}
              className="flex-1"
            >
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              В корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}