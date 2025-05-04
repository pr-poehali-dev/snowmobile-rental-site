
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PromoCodeFormProps {
  subtotal: number;
  onApplyDiscount: (discountAmount: number, promoCode: string) => void;
  onRemoveDiscount: () => void;
}

// Для демонстрации, промокоды захардкожены, в реальном приложении они будут в API
const promoCodes = [
  { code: 'WINTER2025', discount: 0.1, maxDiscount: 5000, minOrder: 10000, description: '10% скидка на зимний сезон' },
  { code: 'NEWUSER', discount: 0.15, maxDiscount: 3000, minOrder: 5000, description: '15% для новых клиентов' },
  { code: 'WEEKEND', discount: 0.05, maxDiscount: 2000, minOrder: 0, description: '5% скидка в выходные' },
];

const PromoCodeForm = ({ subtotal, onApplyDiscount, onRemoveDiscount }: PromoCodeFormProps) => {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    discountAmount: number;
  } | null>(null);

  // Обработчик применения промокода
  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите промокод',
        variant: 'destructive',
      });
      return;
    }

    // Если промокод уже применен
    if (appliedPromo && appliedPromo.code === promoCode) {
      toast({
        title: 'Промокод уже применен',
        description: `Промокод ${promoCode} уже применен к заказу`,
      });
      return;
    }

    setLoading(true);

    try {
      // Имитация задержки API запроса
      await new Promise(resolve => setTimeout(resolve, 800));

      // Проверка промокода (в реальном приложении будет API запрос)
      const foundPromo = promoCodes.find(p => p.code === promoCode.toUpperCase());

      if (!foundPromo) {
        toast({
          title: 'Промокод не найден',
          description: 'Указанный промокод не существует или истек срок его действия',
          variant: 'destructive',
        });
        return;
      }

      // Проверка минимальной суммы заказа
      if (subtotal < foundPromo.minOrder) {
        toast({
          title: 'Недостаточная сумма заказа',
          description: `Промокод действителен для заказов от ${foundPromo.minOrder.toLocaleString()} ₽`,
          variant: 'destructive',
        });
        return;
      }

      // Расчет суммы скидки
      const rawDiscountAmount = subtotal * foundPromo.discount;
      const discountAmount = Math.min(rawDiscountAmount, foundPromo.maxDiscount);

      // Применение скидки
      setAppliedPromo({
        code: foundPromo.code,
        discount: foundPromo.discount * 100,
        discountAmount,
      });

      onApplyDiscount(discountAmount, foundPromo.code);

      toast({
        title: 'Промокод применен',
        description: `Скидка ${foundPromo.discount * 100}% успешно применена к заказу`,
      });
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось применить промокод. Попробуйте позже.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Обработчик удаления промокода
  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    onRemoveDiscount();

    toast({
      title: 'Промокод удален',
      description: 'Промокод был удален из заказа',
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-3">Промокод</h3>
        
        {appliedPromo ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-800 mr-2">
                  {appliedPromo.code}
                </Badge>
                <span className="text-sm">Скидка {appliedPromo.discount}%</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemovePromoCode}
              >
                <Icon name="X" className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-sm">
              <span>Сумма скидки:</span>
              <span className="font-medium text-green-600">
                −{appliedPromo.discountAmount.toLocaleString()} ₽
              </span>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Input
              placeholder="Введите промокод"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleApplyPromoCode} 
              disabled={loading || !promoCode.trim()}
            >
              {loading ? (
                <Icon name="Loader2" className="h-4 w-4 animate-spin" />
              ) : (
                'Применить'
              )}
            </Button>
          </div>
        )}
        
        {!appliedPromo && (
          <div className="mt-3">
            <p className="text-xs text-gray-500">
              Промокоды для тестирования: WINTER2025, NEWUSER, WEEKEND
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromoCodeForm;
