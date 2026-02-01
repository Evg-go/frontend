import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { User } from '@/entities/user/model/types';
import { useUpdateProfile } from '../model/useUpdateProfile';
import { toApiError } from '@/shared/api/errors';


const schema = z.object({
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  phone: z.string().min(1, 'Введите телефон'),

  about: z.string().max(2000, 'Максимум 2000 символов').optional().or(z.literal('')),

  isUserOpenSuggestions: z.boolean(),
  isProfileHidden: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function UpdateProfileForm({
  user,
  onCancel,
  onSaved,
}: {
  user: User;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const mutation = useUpdateProfile();

  const defaultValues = useMemo<FormValues>(() => {
    const u: any = user;

    const isUserOpenSuggestions =
      (u.is_user_open_suggestions ?? false) as boolean;

    const isProfileHidden =
      (u.is_profile_hidden ?? false) as boolean;

    return {
      firstName: (u.first_name ??  '') as string,
      lastName: (u.last_name ?? '') as string,
      phone: (u.phone ?? '') as string,

      about: (u.about ?? '') as string,

      isUserOpenSuggestions,
      isProfileHidden,
    };
  }, [user]);

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,

        about: values.about ?? '',
        is_user_open_suggestions: values.isUserOpenSuggestions,
        is_profile_hidden: values.isProfileHidden,
      });

      onSaved();
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <Field label="Имя" error={form.formState.errors.firstName?.message}>
        <input {...form.register('firstName')} />
      </Field>

      <Field label="Фамилия" error={form.formState.errors.lastName?.message}>
        <input {...form.register('lastName')} />
      </Field>

      <Field label="Телефон" error={form.formState.errors.phone?.message}>
        <input {...form.register('phone')} />
      </Field>

      <Field label="О себе" error={form.formState.errors.about?.message}>
        <textarea
          {...form.register('about')}
          rows={5}
          style={{ width: '100%', padding: 10, borderRadius: 12 }}
        />
      </Field>

      <Checkbox
        label="Я открыт к предложениям"
        descr="Можно показывать, что ты готов получать предложения."
      >
        <input type="checkbox" {...form.register('isUserOpenSuggestions')} />
      </Checkbox>

      <Checkbox
        label="Скрыть профиль"
        descr="Если включено — профиль скрыт от других пользователей."
      >
        <input type="checkbox" {...form.register('isProfileHidden')} />
      </Checkbox>

      {form.formState.errors.root?.message && (
        <div style={{ color: 'var(--danger)' }}>{form.formState.errors.root.message}</div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
}

function Field(props: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{props.label}</div>
      {props.children}
      {props.error && <div style={{ color: 'var(--danger)' }}>{props.error}</div>}
    </div>
  );
}

function Checkbox(props: { label: string; descr?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ marginTop: 2 }}>{props.children}</div>
      <div style={{ display: 'grid', gap: 2 }}>
        <div>{props.label}</div>
        {props.descr && <div style={{ color: 'var(--muted)', fontSize: 13 }}>{props.descr}</div>}
      </div>
    </label>
  );
}
