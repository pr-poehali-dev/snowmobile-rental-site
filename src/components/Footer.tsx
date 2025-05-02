
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SnowRent</h3>
            <p className="text-gray-400 mb-4">
              Прокат снегоходов высокого качества для любителей зимних приключений.
              Разнообразные модели для любых снежных трасс и маршрутов.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="hover:text-blue-400 transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="https://facebook.com" className="hover:text-blue-400 transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-white transition-colors">Каталог</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">О нас</Link></li>
              <li><Link to="/contacts" className="text-gray-400 hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Icon name="MapPin" size={18} />
                <span className="text-gray-400">г. Москва, ул. Снежная, 123</span>
              </li>
              <li className="flex items-center space-x-3">
                <Icon name="Phone" size={18} />
                <a href="tel:+74951234567" className="text-gray-400 hover:text-white transition-colors">+7 (495) 123-45-67</a>
              </li>
              <li className="flex items-center space-x-3">
                <Icon name="Mail" size={18} />
                <a href="mailto:info@snowrent.ru" className="text-gray-400 hover:text-white transition-colors">info@snowrent.ru</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} SnowRent. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
