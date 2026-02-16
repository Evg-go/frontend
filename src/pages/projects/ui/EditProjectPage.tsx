import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cls from './ProjectsPage.module.css';
import { use_project, use_update_project } from '@/entities/project/model/hooks';
import { format_date, iso_to_api_date } from '@/entities/project/lib/date';
import { project_status, project_status_to_number } from '@/entities/project/model/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

type FormValues = z.infer<typeof schema>;

export function EditProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, isError } = use_project(projectId || '');
  const { mutateAsync: updateProject } = use_update_project();

  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    status: project_status.not_started,
    is_open: true,
    started_at: '',
    finished_at: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status,
        is_open: project.is_open ?? true,
        started_at: format_date(project.started_at) || '',
        finished_at: format_date(project.finished_at) || '',
      });
    }
  }, [project]);

  const form = useForm<FormValues>({
    defaultValues: formData,
    resolver: zodResolver(schema),
  });

const onSubmit = async (values: FormValues) => {
  if (projectId) {
    try {

      const started_at = iso_to_api_date(values.started_at);
      const finished_at = iso_to_api_date(values.finished_at || '');

      const statusNumber = project_status_to_number(values.status);


      await updateProject({
        project_id: projectId,
        name: values.name,
        description: values.description || '',
        status: statusNumber, 
        is_open: values.is_open,
        started_at: started_at,
        finished_at:finished_at,
      });


      navigate(`/projects/${projectId}`);
      
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }
};

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки проекта</div>;

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Редактировать проект</h3>
      </div>

      <div className={cls.card}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'grid', gap: 10 }}>
          <div>
            <label>Название</label>
            <input
              {...form.register('name')}
              type="text"
            />
            {form.formState.errors.name && <div>{form.formState.errors.name.message}</div>}
          </div>

          <div>
            <label>Описание</label>
            <textarea
              {...form.register('description')}
            />
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
            <input
              {...form.register('started_at')}
              type="date"
            />
            {form.formState.errors.started_at && <div>{form.formState.errors.started_at.message}</div>}
          </div>

          <div>
            <label>Дата завершения (опционально)</label>
            <input
              {...form.register('finished_at')}
              type="date"
            />
            {form.formState.errors.finished_at && <div>{form.formState.errors.finished_at.message}</div>}
          </div>

          <div>
            <label>Открытый проект</label>
            <input
              {...form.register('is_open')}
              type="checkbox"
            />
          </div>

          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
}
