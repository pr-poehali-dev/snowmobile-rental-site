
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-blue-900 text-white">
      {/* Overlay Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1610742344389-9ebedbe73bf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')" 
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Исследуйте зимние просторы на наших снегоходах</h1>
          <p className="text-xl mb-8">
            Прокат современных снегоходов различных моделей для незабываемых приключений. 
            Подберем идеальный вариант для любого маршрута и уровня подготовки.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="font-medium">
              <Link to="/catalog">Выбрать снегоход</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="font-medium">
              <Link to="/contacts">Связаться с нами</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
