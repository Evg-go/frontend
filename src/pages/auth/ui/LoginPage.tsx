import { Link, useLocation } from 'react-router-dom';
import { LoginForm } from '@/features/auth/login/ui/LoginForm';
import cls from './AuthPage.module.css';

export function LoginPage() {
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <h2 className={cls.title}>Вход</h2>

        <LoginForm from={from} />

        <div className={cls.footer}>
          Нет аккаунта? <Link to="/register" state={{ from }}>Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}
