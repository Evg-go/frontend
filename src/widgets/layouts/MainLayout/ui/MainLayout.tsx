import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setNavigate } from '@/shared/lib/navigation/navigation';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton';

export function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const meQuery = useMe({ enabled: sessionModel.isAuthenticated() });
  const me = meQuery.data;

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/login">Login</Link>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {sessionModel.isAuthenticated() && (
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              {me ? `User: ${me.email ?? me.username ?? me.id ?? 'me'}` : 'User: loading...'}
            </span>
          )}
          {sessionModel.isAuthenticated() && <LogoutButton />}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
