
import { Shield, Clock, Award } from 'lucide-react';
import Icon from '@/components/ui/icon';

const features = [
  {
    icon: 'Award',
    title: 'Высокое качество',
    description: 'Все наши снегоходы проходят тщательную техническую проверку перед каждой арендой'
  },
  {
    icon: 'Clock',
    title: 'Гибкое время аренды',
    description: 'Возможность арендовать снегоход на несколько часов, дней или даже недель'
  },
  {
    icon: 'Shield',
    title: 'Безопасность',
    description: 'Предоставляем всё необходимое защитное снаряжение и проводим инструктаж'
  }
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Icon name={feature.icon} size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
