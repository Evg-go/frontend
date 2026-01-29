import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLogin } from '../model/useLogin';
import { navigateTo } from '@/shared/lib/navigation/navigation';
import { toApiError } from '@/shared/api/errors';

const schema = z.object({
  email: z.email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ from }: { from?: string }) {
  const mutation = useLogin();

  const defaultValues = useMemo<FormValues>(() => ({ email: '', password: '' }), []);

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      // login() сам сохраняет в localStorage
      await mutation.mutateAsync(values);
      navigateTo(from ?? '/', { replace: true });
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <div>
        <div>Email</div>
        <input
          {...form.register('email')}
          style={{ width: '100%', padding: 8 }}
          autoComplete="email"
          inputMode="email"
        />
        {form.formState.errors.email && (
          <div style={{ color: 'crimson' }}>{form.formState.errors.email.message}</div>
        )}
      </div>

      <div>
        <div>Password</div>
        <input
          {...form.register('password')}
          type="password"
          style={{ width: '100%', padding: 8 }}
          autoComplete="current-password"
        />
        {form.formState.errors.password && (
          <div style={{ color: 'crimson' }}>{form.formState.errors.password.message}</div>
        )}
      </div>

      {form.formState.errors.root?.message && (
        <div style={{ color: 'crimson' }}>{form.formState.errors.root.message}</div>
      )}

      <button type="submit" disabled={mutation.isPending} style={{ padding: 10 }}>
        {mutation.isPending ? 'Входим...' : 'Войти'}
      </button>
    </form>
  );
}


