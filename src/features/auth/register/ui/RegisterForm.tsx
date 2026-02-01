import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRegister } from '../model/useRegister';
import { navigateTo } from '@/shared/lib/navigation/navigation';
import { toApiError } from '@/shared/api/errors';

const schema = z
  .object({
    email: z.email('Введите корректный email'),
    firstName: z.string().min(1, 'Введите имя'),
    lastName: z.string().min(1, 'Введите фамилию'),
    phone: z.string().min(1, 'Введите телефон'),
    password: z.string().min(6, 'Минимум 6 символов'),
    passwordConfirm: z.string().min(6, 'Повторите пароль'),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm'],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm({ from }: { from?: string }) {
  const mutation = useRegister();

  const defaultValues = useMemo<FormValues>(
    () => ({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    }),
    [],
  );

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
      });

      navigateTo('/login', {
        replace: true,
        state: { email: values.email, justRegistered: true, from },
      });
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  const err = form.formState.errors;

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Field label="Email" error={err.email?.message}>
        <input {...form.register('email')} style={{ width: '100%', padding: 8 }} autoComplete="email" />
      </Field>

      <Field label="Имя" error={err.firstName?.message}>
        <input {...form.register('firstName')} style={{ width: '100%', padding: 8 }} autoComplete="given-name" />
      </Field>

      <Field label="Фамилия" error={err.lastName?.message}>
        <input {...form.register('lastName')} style={{ width: '100%', padding: 8 }} autoComplete="family-name" />
      </Field>

      <Field label="Телефон" error={err.phone?.message}>
        <input {...form.register('phone')} style={{ width: '100%', padding: 8 }} autoComplete="tel" />
      </Field>

      <Field label="Пароль" error={err.password?.message}>
        <input {...form.register('password')} type="password" style={{ width: '100%', padding: 8 }} autoComplete="new-password" />
      </Field>

      <Field label="Подтвердите пароль" error={err.passwordConfirm?.message}>
        <input {...form.register('passwordConfirm')} type="password" style={{ width: '100%', padding: 8 }} autoComplete="new-password" />
      </Field>

      {err.root?.message && <div style={{ color: 'crimson' }}>{err.root.message}</div>}

      <button type="submit" disabled={mutation.isPending} style={{ padding: 10 }}>
        {mutation.isPending ? 'Создание...' : 'Создать аккаунт'}
      </button>
    </form>
  );
}

function Field(props: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div>{props.label}</div>
      {props.children}
      {props.error && <div style={{ color: 'crimson' }}>{props.error}</div>}
    </div>
  );
}
