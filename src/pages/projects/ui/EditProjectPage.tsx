import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import cls from './ProjectsPage.module.css';

import { use_project, use_update_project } from '@/entities/project/model/hooks';
import { format_date, iso_to_api_date } from '@/entities/project/lib/date';
import {
  project_status,
  project_status_to_number,
} from '@/entities/project/model/types';
import { Button } from '@/shared/ui/Button';

const schema = z.object({
  name: z.string().min(1, 'Введите название'),
  description: z.string().optional(),
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

type Form_values = z.infer<typeof schema>;

function normalize_project_status(value: unknown): Form_values['status'] {
  if (typeof value === 'number') {
    if (value === 1) return project_status.not_started;
    if (value === 2) return project_status.in_progress;
    if (value === 3) return project_status.done;
    if (value === 4) return project_status.on_hold;
    return project_status.not_started;
  }

  const str = String(value ?? '').toUpperCase();

  if (str.endsWith('NOT_STARTED')) return project_status.not_started;
  if (str.endsWith('IN_PROGRESS')) return project_status.in_progress;
  if (str.endsWith('DONE')) return project_status.done;
  if (str.endsWith('ON_HOLD')) return project_status.on_hold;

  return project_status.not_started;
}

function normalize_date_for_input(value: unknown): string {
  const formatted = format_date(value);
  return formatted === '—' ? '' : formatted;
}

export function EditProjectPage() {
  const { projectId: project_id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = use_project(project_id || '');
  const { mutateAsync: update_project } = use_update_project();

  const default_values = useMemo<Form_values>(
    () => ({
      name: '',
      description: '',
      status: project_status.not_started,
      is_open: true,
      started_at: '',
      finished_at: '',
    }),
    [],
  );

  const form = useForm<Form_values>({
    defaultValues: default_values,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!project) {
      return;
    }

    const project_data = project as Record<string, unknown>;

    form.reset({
      name: String(project_data.name ?? ''),
      description: String(project_data.description ?? ''),
      status: normalize_project_status(project_data.status),
      is_open: Boolean(project_data.is_open ?? project_data.isOpen ?? true),
      started_at: normalize_date_for_input(project_data.started_at ?? project_data.startedAt),
      finished_at: normalize_date_for_input(project_data.finished_at ?? project_data.finishedAt),
    });
  }, [form, project]);

  async function on_submit(values: Form_values) {
    if (!project_id) {
      return;
    }

    try {
      const started_at = iso_to_api_date(values.started_at);

      const finished_at = values.finished_at
        ? iso_to_api_date(values.finished_at)
        : { year: 0, month: 0, day: 0 };

      await update_project({
        project_id,
        name: values.name,
        description: values.description || '',
        status: project_status_to_number(values.status),
        is_open: values.is_open,
        started_at,
        finished_at,
      });

      navigate(`/projects/${project_id}`);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки проекта</div>;

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Редактировать проект</h3>
      </div>

      <div className={cls.card}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/projects/${project_id}/edit/skills`)}
            disabled={!project_id}
          >
            Редактировать скиллы
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(on_submit)} style={{ display: 'grid', gap: 10 }}>
          <div>
            <label>Название</label>
            <input {...form.register('name')} type="text" />
            {form.formState.errors.name && <div>{form.formState.errors.name.message}</div>}
          </div>

          <div>
            <label>Описание</label>
            <textarea {...form.register('description')} />
          </div>

          <div>
            <label>Статус</label>
            <select {...form.register('status')}>
              <option value={project_status.not_started}>Не начат</option>
              <option value={project_status.in_progress}>В работе</option>
              <option value={project_status.done}>Завершён</option>
              <option value={project_status.on_hold}>На паузе</option>
            </select>
          </div>

          <div>
            <label>Дата начала (YYYY-MM-DD)</label>
            <input {...form.register('started_at')} type="date" />
            {form.formState.errors.started_at && <div>{form.formState.errors.started_at.message}</div>}
          </div>

          <div>
            <label>Дата завершения (опционально)</label>
            <input {...form.register('finished_at')} type="date" />
            {form.formState.errors.finished_at && <div>{form.formState.errors.finished_at.message}</div>}
          </div>

          <div>
            <label>Открытый проект</label>
            <input {...form.register('is_open')} type="checkbox" />
          </div>

          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
}