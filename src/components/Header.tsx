
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/public/logo-b.svg" alt="SnowRent" className="h-10" />
            <span className="text-2xl font-bold text-blue-600">SnowRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-blue-600 transition-colors">Главная</Link>
            <Link to="/catalog" className="font-medium hover:text-blue-600 transition-colors">Каталог</Link>
            <Link to="/about" className="font-medium hover:text-blue-600 transition-colors">О нас</Link>
            <Link to="/contacts" className="font-medium hover:text-blue-600 transition-colors">Контакты</Link>
          </nav>

          {/* User and Cart Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <Icon name="ShoppingCart" size={22} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Icon name="User" size={18} />
                <span>Войти</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <Link to="/" className="font-medium hover:text-blue-600 transition-colors">Главная</Link>
            <Link to="/catalog" className="font-medium hover:text-blue-600 transition-colors">Каталог</Link>
            <Link to="/about" className="font-medium hover:text-blue-600 transition-colors">О нас</Link>
            <Link to="/contacts" className="font-medium hover:text-blue-600 transition-colors">Контакты</Link>
            <div className="flex items-center space-x-4 pt-2">
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Icon name="ShoppingCart" size={18} />
                  <span>Корзина</span>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Icon name="User" size={18} />
                  <span>Войти</span>
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
