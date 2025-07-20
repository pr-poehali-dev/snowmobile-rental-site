
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Snowmobile } from '@/types/snowmobile';
import Icon from '@/components/ui/icon';
import AddToCartDialog from '@/components/cart/AddToCartDialog';

interface SnowmobileCardProps {
  snowmobile: Snowmobile;
  onAddToCart?: (snowmobile: Snowmobile) => void;
}

const SnowmobileCard = ({ snowmobile, onAddToCart }: SnowmobileCardProps) => {
  const [showAddToCart, setShowAddToCart] = useState(false);
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={snowmobile.image} 
          alt={snowmobile.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{snowmobile.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-3 line-clamp-2">{snowmobile.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Icon name="Zap" size={16} className="text-blue-500" />
            <span>{snowmobile.specifications.power}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Gauge" size={16} className="text-blue-500" />
            <span>{snowmobile.specifications.maxSpeed}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-lg">{snowmobile.pricePerDay} ₽/день</p>
            <p className="text-sm text-gray-500">{snowmobile.pricePerWeek} ₽/неделя</p>
          </div>
          <div className="flex items-center">
            {snowmobile.available ? (
              <span className="inline-flex items-center text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                Доступен
              </span>
            ) : (
              <span className="inline-flex items-center text-red-600 text-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                Занят
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="w-full"
          asChild
        >
          <Link to={`/snowmobile/${snowmobile.id}`}>Подробнее</Link>
        </Button>
        <Button 
          className="w-full"
          disabled={!snowmobile.available}
          onClick={() => {
            if (onAddToCart) {
              onAddToCart(snowmobile);
            } else {
              setShowAddToCart(true);
            }
          }}
        >
          В корзину
        </Button>
      </CardFooter>

      {/* Диалог добавления в корзину */}
      <AddToCartDialog
        isOpen={showAddToCart}
        onClose={() => setShowAddToCart(false)}
        snowmobile={snowmobile}
      />
    </Card>
  );
};

export default SnowmobileCard;