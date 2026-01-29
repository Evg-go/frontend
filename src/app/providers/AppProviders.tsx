import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import { setUnauthorizedHandler } from '@/shared/api/unauthorized';
import { clearTokens } from '@/entities/session/model/authStorage';
import { navigateTo } from '@/shared/lib/navigation/navigation';

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearTokens();
      queryClient.clear();
      navigateTo('/login', { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

