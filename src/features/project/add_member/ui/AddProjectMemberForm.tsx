import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { use_add_project_member } from '@/entities/project/model/hooks';
import { toApiError } from '@/shared/api/errors';

const schema = z.object({
  user_id: z.string().uuid('Нужен корректный uuid'),
  manager_rights: z.boolean(),
  manager_member: z.boolean(),
  manager_projects: z.boolean(),
  manager_tasks: z.boolean(),
});

type form_values = z.infer<typeof schema>;

export function AddProjectMemberForm({ project_id }: { project_id: string }) {
  const mutation = use_add_project_member(project_id);

  const default_values = useMemo<form_values>(
    () => ({
      user_id: '',
      manager_rights: false,
      manager_member: false,
      manager_projects: false,
      manager_tasks: false,
    }),
    [],
  );

  const form = useForm<form_values>({
    defaultValues: default_values,
    resolver: zodResolver(schema),
  });

  const on_submit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        user_id: values.user_id,
        rights: {
          manager_rights: values.manager_rights,
          manager_member: values.manager_member,
          manager_projects: values.manager_projects,
          manager_tasks: values.manager_tasks,
        },
      });

      form.reset(default_values);
    } catch (e) {
      const api_error = toApiError(e);
      form.setError('user_id', { message: api_error.message });
    }
  });

  return (
    <form onSubmit={on_submit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <div>
        <label>user_id</label>
        <input {...form.register('user_id')} placeholder="uuid пользователя" />
        {form.formState.errors.user_id?.message ? (
          <div style={{ color: 'crimson' }}>{form.formState.errors.user_id.message}</div>
        ) : null}
      </div>

      <label><input type="checkbox" {...form.register('manager_rights')} /> manager_rights</label>
      <label><input type="checkbox" {...form.register('manager_member')} /> manager_member</label>
      <label><input type="checkbox" {...form.register('manager_projects')} /> manager_projects</label>
      <label><input type="checkbox" {...form.register('manager_tasks')} /> manager_tasks</label>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Добавляю...' : 'Добавить участника'}
      </button>
    </form>
  );
}
