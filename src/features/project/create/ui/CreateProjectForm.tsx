import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { toApiError } from '@/shared/api/errors';
import { useCreateProject } from '../model/useCreateProject';
import { parseDateInput } from '@/entities/project/lib/date';
import { ProjectStatus } from '@/entities/project/model/types';

const schema = z.object({
  teamId: z.string().min(1, 'Введите team_id'),
  name: z.string().min(1, 'Введите название проекта'),
  description: z.string().optional().or(z.literal('')),

  status: z.nativeEnum(ProjectStatus).optional(),
  isOpen: z.boolean(),

  startedAt: z.string().optional().or(z.literal('')),
  finishedAt: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function CreateProjectForm(props: {
  onCreated?: (createdId?: string) => void;
  listParams?: Record<string, unknown>;
}) {
  const mutation = useCreateProject(props.listParams);

  const defaultValues = useMemo<FormValues>(
    () => ({
      teamId: '',
      name: '',
      description: '',
      status: ProjectStatus.PROJECT_STATUS_UNSPECIFIED,
      isOpen: true,
      startedAt: '',
      finishedAt: '',
    }),
    [],
  );

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const startedAt = values.startedAt ? parseDateInput(values.startedAt) : undefined;
      const finishedAt = values.finishedAt ? parseDateInput(values.finishedAt) : undefined;

      const created = await mutation.mutateAsync({
        teamId: values.teamId,
        name: values.name,
        description: values.description || undefined,
        status: values.status ?? ProjectStatus.PROJECT_STATUS_UNSPECIFIED,
        isOpen: values.isOpen,
        startedAt,
        finishedAt,
      });

      form.reset(defaultValues);
      props.onCreated?.(created?.id);
    } catch (e) {
      const apiErr = toApiError(e);
      form.setError('root', { message: apiErr.message });
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
      <Field label="Team ID" error={form.formState.errors.teamId?.message}>
        <input {...form.register('teamId')} placeholder="UUID команды" />
      </Field>

      <Field label="Название" error={form.formState.errors.name?.message}>
        <input {...form.register('name')} placeholder="Например: Marketplace" />
      </Field>

      <Field label="Описание" error={form.formState.errors.description?.message}>
        <textarea {...form.register('description')} rows={3} />
      </Field>

      <Field label="Статус">
        <select {...form.register('status')}>
          <option value={ProjectStatus.PROJECT_STATUS_UNSPECIFIED}>Любой / не задан</option>
          <option value={ProjectStatus.PROJECT_STATUS_PLANNED}>Planned</option>
          <option value={ProjectStatus.PROJECT_STATUS_ACTIVE}>Active</option>
          <option value={ProjectStatus.PROJECT_STATUS_PAUSED}>Paused</option>
          <option value={ProjectStatus.PROJECT_STATUS_DONE}>Done</option>
          <option value={ProjectStatus.PROJECT_STATUS_ARCHIVED}>Archived</option>
        </select>
      </Field>

      <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="checkbox" {...form.register('isOpen')} />
        <span>Проект открыт (is_open)</span>
      </label>

      <Field label="Дата старта (started_at)">
        <input type="date" {...form.register('startedAt')} />
      </Field>

      <Field label="Дата завершения (finished_at)">
        <input type="date" {...form.register('finishedAt')} />
      </Field>

      {form.formState.errors.root?.message && (
        <div style={{ color: 'var(--danger)' }}>{form.formState.errors.root.message}</div>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Создаём...' : 'Создать проект'}
      </button>
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
