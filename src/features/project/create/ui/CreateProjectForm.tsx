import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { use_create_project } from '@/entities/project/model/hooks';
import { project_status } from '@/entities/project/model/types';
import { toApiError } from '@/shared/api/errors';

const schema = z.object({
  name: z.string().min(1, 'Введите название'),
  description: z.string().optional(),
  team_name: z.string().optional(),

  status: z.enum([
    project_status.not_started,
    project_status.in_progress,
    project_status.done,
    project_status.on_hold,
  ]),
  is_open: z.boolean(),

  started_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат: YYYY-MM-DD'),
  finished_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат: YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
});

type form_values = z.infer<typeof schema>;

type Props = {
  on_created?: () => void;
};

export function CreateProjectForm({ on_created }: Props) {
  const mutation = use_create_project();

  const default_values = useMemo<form_values>(
    () => ({
      name: '',
      description: '',
      team_name: '',
      status: project_status.not_started,
      is_open: true,
      started_at: '',
      finished_at: '',
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
        name: values.name,
        description: values.description || '',
        team_name: values.team_name || '',
        status: values.status,
        is_open: values.is_open,
        started_at: values.started_at,
        finished_at: values.finished_at ? values.finished_at : null,
      });

      // ✅ успех — сбрасываем форму и сообщаем родителю
      form.reset(default_values);
      on_created?.();
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  return (
    <form onSubmit={on_submit} style={{ display: 'grid', gap: 10 }}>
      <div>
        <div>Название</div>
        <input {...form.register('name')} />
        {form.formState.errors.name && <div>{form.formState.errors.name.message}</div>}
      </div>

      <div>
        <div>Описание</div>
        <textarea {...form.register('description')} rows={3} />
      </div>

      <div>
        <div>Team name (опционально)</div>
        <input {...form.register('team_name')} />
      </div>

      <div>
        <div>Статус</div>
        <select {...form.register('status')}>
          <option value={project_status.not_started}>NOT_STARTED</option>
          <option value={project_status.in_progress}>IN_PROGRESS</option>
          <option value={project_status.done}>DONE</option>
          <option value={project_status.on_hold}>ON_HOLD</option>
        </select>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="checkbox" {...form.register('is_open')} />
        Открытый проект (is_open)
      </label>

      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div>Started at (YYYY-MM-DD)</div>
          <input {...form.register('started_at')} placeholder="2026-02-11" />
          {form.formState.errors.started_at && <div>{form.formState.errors.started_at.message}</div>}
        </div>

        <div>
          <div>Finished at (опционально)</div>
          <input {...form.register('finished_at')} placeholder="2026-03-01" />
          {form.formState.errors.finished_at && <div>{form.formState.errors.finished_at.message}</div>}
        </div>
      </div>

      {form.formState.errors.root?.message && <div>{form.formState.errors.root.message}</div>}
      {mutation.isError && !form.formState.errors.root?.message && <div>Ошибка создания проекта</div>}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Создание...' : 'Создать проект'}
      </button>
    </form>
  );
}
