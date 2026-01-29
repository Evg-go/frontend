import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasValidSession } from '@/entities/session/model/authStorage';

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation();

  if (!hasValidSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
