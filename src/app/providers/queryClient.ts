import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

function getStatus(error: unknown): number | null {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }
  return null;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // глобально ограничиваем ретраи
      retry: (failureCount, error) => {
        const status = getStatus(error);

        // не ретраим на любые клиентские ошибки
        if (status && status >= 400 && status < 500) return false;

        // сетевые ошибки / 5xx — ретраим ограниченно
        return failureCount < 1;
      },

      //задержка ретрая 
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),

      //  чтобы не было рефетч-качелей
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,

      // как часто запрос считается устаревшим
      staleTime: 30_000,

      // чтобы ошибки не зависали слишком долго
      gcTime: 10 * 60_000, // 10 минут 
    },

    mutations: {
      retry: false,
    },
  },
});
