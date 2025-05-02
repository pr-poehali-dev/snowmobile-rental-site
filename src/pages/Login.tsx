
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCredentials } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import Icon from '@/components/ui/icon';

const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов' }),
});

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserCredentials) => {
    setLoading(true);
    try {
      // В реальном приложении здесь будет запрос к API
      await login(data);
      toast({
        title: 'Успешный вход',
        description: 'Вы успешно вошли в систему',
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Неверный email или пароль',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img src="/public/logo-b.svg" alt="SnowRent" className="h-12 mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Вход в систему</h2>
          <p className="mt-2 text-sm text-gray-600">
            Введите данные для доступа к панели управления
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.ru"
                      {...field}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите ваш пароль"
                      type="password"
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Забыли пароль?
                </Link>
              </div>
              <div className="text-sm">
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Регистрация
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Войти
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-500">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
