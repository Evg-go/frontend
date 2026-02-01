import { Link, useLocation } from 'react-router-dom';
import cls from './AuthPage.module.css';
import { RegisterForm } from '@/features/auth/register/ui/RegisterForm';

export function RegisterPage() {
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <h2 className={cls.title}>Регистрация</h2>

        <RegisterForm from={from} />

        <div className={cls.footer}>
          Уже есть аккаунт? <Link to="/login" state={{ from }}>Войти</Link>
        </div>
      </div>
    </div>
  );
}
