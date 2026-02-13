import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { use_public_projects } from '@/entities/project/model/hooks';
import { project_status } from '@/entities/project/model/types';
import { format_date } from '@/entities/project/lib/date';
import { project_status_label } from '@/entities/project/lib/status';

export function ProjectsPage() {
  const [query, set_query] = useState('');
  const [status, set_status] = useState(project_status.unspecified);

  const params = useMemo(
    () => ({
      query,
      status,
      page_size: 10,
    }),
    [query, status],
  );

  const q = use_public_projects(params);
  const projects = q.data?.pages.flatMap((p) => p.projects) ?? [];

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проекты</h3>
      </div>

      <div className={cls.card} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={query} onChange={(e) => set_query(e.target.value)} placeholder="Поиск..." />

          <select value={status} onChange={(e) => set_status(e.target.value as any)}>
            <option value={project_status.unspecified}>Любой статус</option>
            <option value={project_status.not_started}>NOT_STARTED</option>
            <option value={project_status.in_progress}>IN_PROGRESS</option>
            <option value={project_status.done}>DONE</option>
            <option value={project_status.on_hold}>ON_HOLD</option>
          </select>
        </div>

        {q.isLoading && <div>Загрузка...</div>}
        {q.isError && <div>Ошибка загрузки списка</div>}

        {!q.isLoading && !q.isError && projects.length === 0 && <div>Ничего не найдено</div>}

        {!q.isLoading && !q.isError && projects.length > 0 && (
          <div style={{ display: 'grid', gap: 10 }}>
            {projects.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className={cls.item}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <b>{p.name}</b>
                  <span>{project_status_label(p.status)}</span>
                </div>
                <div className={cls.itemDesc}>{p.description || '—'}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>
                  started: {format_date(p.started_at)} • created: {format_date(p.created_at)}
                </div>
              </Link>
            ))}
          </div>
        )}

        {q.hasNextPage && (
          <button onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>
            {q.isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
          </button>
        )}
      </div>
    </div>
  );
}
