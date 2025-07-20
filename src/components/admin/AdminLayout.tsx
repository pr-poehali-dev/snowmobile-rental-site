
import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { path: '/admin', label: 'Дашборд', icon: 'LayoutDashboard' },
  { path: '/admin/snowmobiles', label: 'Снегоходы', icon: 'Package' },
  { path: '/admin/orders', label: 'Заказы', icon: 'ShoppingCart' },
  { path: '/admin/users', label: 'Пользователи', icon: 'Users' },
  { path: '/admin/settings', label: 'Настройки', icon: 'Settings' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Выход из системы',
      description: 'Вы успешно вышли из системы',
    });
    navigate('/login');
  };

  // Проверка прав администратора
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <Icon name="ShieldAlert" size={64} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Доступ запрещен</h1>
          <p className="text-gray-600 mb-6">У вас нет прав для доступа к административной панели</p>
          <Button onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/public/logo-b.svg" alt="SnowRent" className="h-8" />
              <span className="text-xl font-bold">SnowRent</span>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <Icon name={item.icon} size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-semibold text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-64'
      }`}>
        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;