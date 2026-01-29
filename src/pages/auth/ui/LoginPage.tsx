import { Link, useLocation } from 'react-router-dom';
import { LoginForm } from '@/features/auth/login/ui/LoginForm';

export function LoginPage() {
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;

  return (
    <div>
      <h2>Вход</h2>
      <LoginForm from={from} />
      <div style={{ marginTop: 12 }}>
        Нет аккаунта? <Link to="/register" state={{ from }}>Зарегистрироваться</Link>
      </div>
    </div>
  );
}
