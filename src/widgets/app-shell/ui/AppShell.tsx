import { useEffect, useMemo } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import cls from './AppShell.module.css';

import { setNavigate } from '@/shared/lib/navigation/navigation';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton';

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

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


  const showCreateProject = useMemo(() => {
    const p = location.pathname;
    return p === '/projects' || p.startsWith('/projects/');
  }, [location.pathname]);

  return (
    <div className={cls.shell}>
      <aside className={cls.sidebar}>
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
        <div className={cls.actions}>
          {isAuth && showCreateProject && (
            <Link to="/projects/new">Создать проект</Link>
          )}
            <Link to="/projects/my">Мои проекты</Link>
        </div>

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
