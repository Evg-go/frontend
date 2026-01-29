import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/userApi';
import { userQueryKeys } from './queryKeys';

export function useMe(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: getMe,
    enabled: opts?.enabled ?? true,
    retry: false, // важно: не ретраим бесконечно, если 401/неверный токен
  });
}