import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import cls from './AppShell.module.css';

import { setNavigate } from '@/shared/lib/navigation/navigation';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton';

export function AppShell() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const isAuth = sessionModel.isAuthenticated();
  const meQuery = useMe({ enabled: isAuth });
  const me = meQuery.data;

  const displayName =
    (me as any)?.email ??
    (me as any)?.username ??
    (me as any)?.id ??
    'me';

  return (
    <div className={cls.shell}>
      <aside className={cls.sidebar}>
        <div className={cls.brand}>My Project</div>
        <nav className={cls.nav}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/teams">Teams</NavLink>
          {isAuth && <NavLink to="/profile">Profile</NavLink>}
          {!isAuth && <NavLink to="/login">Login</NavLink>}
          {!isAuth && <NavLink to="/register">Register</NavLink>}
        </nav>
      </aside>

      <header className={cls.header}>
        <Link to="/" style={{ fontWeight: 600, opacity: 0.95 }}>Dashboard</Link>

        <div className={cls.right}>
          {isAuth && (
            <div className={cls.user}>
              {me ? `User: ${displayName}` : 'User: loading...'}
            </div>
          )}
          {isAuth && <LogoutButton />}
        </div>
      </header>

      <main className={cls.content}>
        <Outlet />
      </main>
    </div>
  );
}
