import { Link, useLocation } from 'react-router-dom';
import { RegisterForm } from '@/features/auth/register/ui/RegisterForm';

export function RegisterPage() {
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  return (
    <div>
      <h2>Регистрация</h2>
      <RegisterForm from={from} />
      <div style={{ marginTop: 12 }}>
        Уже есть аккаунт? <Link to="/login" state={{ from }}>Войти</Link>
      </div>
    </div>
  );
}
