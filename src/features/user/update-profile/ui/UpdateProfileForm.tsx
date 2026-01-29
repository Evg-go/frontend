import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import type { User } from '@/entities/user/model/types';
import { useUpdateProfile } from '../model/useUpdateProfile';
import { toApiError } from '@/shared/api/errors';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';

const schema = z.object({
  firstName: z.string().min(1, 'Введите имя'),
  lastName: z.string().min(1, 'Введите фамилию'),
  phone: z.string().min(1, 'Введите телефон'),
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
    const firstName = ((user as any).first_name ?? (user as any).firstName ?? '') as string;
    const lastName = ((user as any).last_name ?? (user as any).lastName ?? '') as string;
    const phone = ((user as any).phone ?? '') as string;

    return { firstName, lastName, phone };
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
      });
      onSaved();
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <Field label="First name" error={form.formState.errors.firstName?.message}>
        <Input {...form.register('firstName')} autoComplete="given-name" />
      </Field>

      <Field label="Last name" error={form.formState.errors.lastName?.message}>
        <Input {...form.register('lastName')} autoComplete="family-name" />
      </Field>

      <Field label="Phone" error={form.formState.errors.phone?.message}>
        <Input {...form.register('phone')} autoComplete="tel" />
      </Field>

      {form.formState.errors.root?.message && (
        <div style={{ color: 'var(--danger)' }}>{form.formState.errors.root.message}</div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <Button type="submit" variant="primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field(props: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: 6, color: 'var(--muted)', fontSize: 13 }}>{props.label}</div>
      {props.children}
      {props.error && <div style={{ color: 'var(--danger)', marginTop: 6 }}>{props.error}</div>}
    </div>
  );
}
