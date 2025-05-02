
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const testimonials = [
  {
    id: 1,
    name: 'Александр Петров',
    role: 'Любитель экстрима',
    content: 'Отличный сервис! Арендовал снегоход на выходные для поездки в горы. Техника в идеальном состоянии, персонал очень внимательный. Обязательно вернусь снова.',
    rating: 5
  },
  {
    id: 2,
    name: 'Елена Соколова',
    role: 'Турист',
    content: 'Впервые каталась на снегоходе, и это было незабываемо! Сотрудники SnowRent всё подробно объяснили, провели инструктаж и подобрали модель, подходящую для новичка.',
    rating: 5
  },
  {
    id: 3,
    name: 'Дмитрий Иванов',
    role: 'Постоянный клиент',
    content: 'Уже третий сезон беру в аренду снегоходы только здесь. Хорошие цены, отличное обслуживание, и главное – техника всегда в идеальном состоянии.',
    rating: 4
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Отзывы наших клиентов</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon 
                      key={i}
                      name="Star" 
                      size={18} 
                      className={i < testimonial.rating ? "text-yellow-500" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
