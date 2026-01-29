import type { PropsWithChildren } from 'react';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';

export function AppInit({ children }: PropsWithChildren) {
  const enabled = sessionModel.isAuthenticated();
  const meQuery = useMe({ enabled });

  // если токена нет - ничего не грузим
  if (!enabled) return children;

  // если токен есть - ждем GetMe (чтобы понять кто пользователь)
  if (meQuery.isLoading) {
    return <div style={{ padding: 16 }}>Loading session...</div>;
  }

  // ошибки (включая 401) уже обработаются интерсептором + unauthorized handler
  return children;
}
