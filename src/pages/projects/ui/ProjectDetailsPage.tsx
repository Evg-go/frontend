import { Link, useParams } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { use_project } from '@/entities/project/model/hooks';
import { format_date } from '@/entities/project/lib/date';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project_id = projectId ?? '';

  const q = use_project(project_id);

  const status_code = (q.error as any)?.status ?? (q.error as any)?.status_code;

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проект</h3>
        <Link to="/projects">← Назад</Link>
      </div>

      <div className={cls.card}>
        {q.isLoading && <div>Загрузка...</div>}

        {q.isError && status_code === 403 && (
          <div>
            Нет доступа: проект закрытый, и вы не участник. <br />
            (позже сюда добавим кнопку “Подать заявку на вступление”)
          </div>
        )}

        {q.isError && status_code !== 403 && <div>Ошибка загрузки проекта</div>}

        {!q.isLoading && !q.isError && q.data && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div><b>ID:</b> {q.data.id}</div>
            <div><b>Team ID:</b> {q.data.team_id}</div>
            <div><b>Creator ID:</b> {q.data.creator_id}</div>

            <div><b>Название:</b> {q.data.name}</div>
            <div><b>Описание:</b> {q.data.description || '—'}</div>

            <div>
              <b>Статус:</b> {q.data.status} • <b>Открыт:</b> {q.data.is_open ? 'Yes' : 'No'}
            </div>

            <div>
              <b>Started:</b> {format_date(q.data.started_at)} • <b>Finished:</b> {format_date(q.data.finished_at)}
            </div>

            <div>
              <b>Created:</b> {format_date(q.data.created_at)} • <b>Updated:</b> {format_date(q.data.updated_at)}
            </div>

            <div style={{ marginTop: 10 }}>
              <b>Raw:</b>
              <pre className={cls.itemDesc} style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(q.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
