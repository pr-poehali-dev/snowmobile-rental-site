
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import TestimonialSection from '@/components/TestimonialSection';
import SnowmobileCard from '@/components/SnowmobileCard';
import { Button } from '@/components/ui/button';
import { Snowmobile } from '@/types/snowmobile';
import { useToast } from '@/hooks/use-toast';

// Моковые данные для отображения на главной странице
const featuredSnowmobiles: Snowmobile[] = [
  {
    id: 1,
    name: 'Arctic Cat Bearcat 570',
    description: 'Надежный утилитарный снегоход с отличной проходимостью. Идеален для работы и отдыха.',
    price: 950000,
    pricePerDay: 5000,
    pricePerWeek: 30000,
    image: 'https://images.unsplash.com/photo-1612459284970-e8f84753d3b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '65 л.с.',
      weight: '290 кг',
      maxSpeed: '110 км/ч',
      fuelCapacity: '40 л'
    },
    available: true
  },
  {
    id: 2,
    name: 'Ski-Doo Expedition Sport',
    description: 'Многофункциональный снегоход для активного отдыха и путешествий. Комфортный и мощный.',
    price: 1100000,
    pricePerDay: 6000,
    pricePerWeek: 36000,
    image: 'https://images.unsplash.com/photo-1518566585952-954bb14432d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '4-тактный',
      power: '95 л.с.',
      weight: '315 кг',
      maxSpeed: '130 км/ч',
      fuelCapacity: '45 л'
    },
    available: true
  },
  {
    id: 3,
    name: 'Yamaha VK540',
    description: 'Классический утилитарный снегоход с высокой надежностью и отличной проходимостью.',
    price: 870000,
    pricePerDay: 4500,
    pricePerWeek: 27000,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specifications: {
      engineType: '2-тактный',
      power: '55 л.с.',
      weight: '310 кг',
      maxSpeed: '100 км/ч',
      fuelCapacity: '38 л'
    },
    available: false
  }
];

const Index = () => {
  const { toast } = useToast();
  
  const handleAddToCart = (snowmobile: Snowmobile) => {
    toast({
      title: "Добавлено в корзину",
      description: `${snowmobile.name} добавлен в корзину`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Популярные модели</h2>
            <Button variant="outline" asChild>
              <a href="/catalog">Смотреть все</a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSnowmobiles.map(snowmobile => (
              <SnowmobileCard 
                key={snowmobile.id} 
                snowmobile={snowmobile} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
        
        <FeatureSection />
        <TestimonialSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
