import { Link, useParams } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { useProject } from '@/entities/project/model/hooks';
import { formatDate } from '@/entities/project/lib/date';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const id = projectId ?? '';

  const q = useProject(id);

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проект</h3>
        <Link to="/projects">← Назад</Link>
      </div>

      <div className={cls.card}>
        {q.isLoading && <div>Загрузка...</div>}
        {q.isError && <div>Ошибка загрузки проекта</div>}

        {!q.isLoading && !q.isError && q.data && (
          <div style={{ display: 'grid', gap: 10 }}>
            <div><b>ID:</b> {q.data.id}</div>
            <div><b>Team ID:</b> {q.data.teamId}</div>
            <div><b>Creator ID:</b> {q.data.creatorId}</div>

            <div><b>Название:</b> {q.data.name}</div>
            <div><b>Описание:</b> {q.data.description || '—'}</div>

            <div>
              <b>Статус:</b> {q.data.status} • <b>Открыт:</b> {q.data.isOpen ? 'Yes' : 'No'}
            </div>

            <div>
              <b>Started:</b> {formatDate(q.data.startedAt)} • <b>Finished:</b> {formatDate(q.data.finishedAt)}
            </div>

            <div>
              <b>Created:</b> {q.data.createdAt || '—'} • <b>Updated:</b> {q.data.updatedAt || '—'}
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
