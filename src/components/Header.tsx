
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart } from '@/hooks/use-cart';
import Cart from '@/components/cart/Cart';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { state } = useCart();

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
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <Icon name="ShoppingCart" size={22} />
              {state.itemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {state.itemCount}
                </Badge>
              )}
            </Button>
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCartOpen(true)}
                className="flex items-center space-x-2 relative"
              >
                <Icon name="ShoppingCart" size={18} />
                <span>Корзина</span>
                {state.itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center"
                  >
                    {state.itemCount}
                  </Badge>
                )}
              </Button>
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

      {/* Cart Sidebar */}
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)}
        onProceedToBooking={() => {
          // Навигация к странице оформления бронирования
          window.location.href = '/cart-booking';
        }}
      />
    </header>
  );
};

export default Header;