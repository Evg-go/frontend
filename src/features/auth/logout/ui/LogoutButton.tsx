import { useQueryClient } from '@tanstack/react-query';
import { sessionModel } from '@/entities/session/model/session';
import { navigateTo } from '@/shared/lib/navigation/navigation';

export function LogoutButton() {
  const qc = useQueryClient();

  const onLogout = () => {
    sessionModel.clear();
    qc.clear();
    navigateTo('/login', { replace: true });
  };

  return (
    <button onClick={onLogout} style={{ padding: 6 }}>
      Выход
    </button>
  );
}
