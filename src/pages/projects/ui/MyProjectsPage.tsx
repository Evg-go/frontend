import { useState} from 'react';
import { Link } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { use_my_projects } from '@/entities/project/model/hooks';
import { format_date } from '@/entities/project/lib/date';
import type { Project } from '@/features/project/model/project';
import { project_status_label } from '@/entities/project/lib/status';

export function MyProjectsPage() {
  const [query, setQuery] = useState('');

  const { data: projects, isLoading, isError } = use_my_projects({ enabled: true });

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Мои проекты</h3>
        <Link to="/projects">← Назад</Link>
      </div>

      <div className={cls.card}>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск..."
          />
        </div>

        {isLoading && <div>Загрузка...</div>}
        {isError && <div>Ошибка загрузки списка</div>}

        {!isLoading && !isError && projects?.length === 0 && <div>Ничего не найдено</div>}

        {!isLoading && !isError && projects?.length > 0 && (
          <div style={{ display: 'grid', gap: 10 }}>
            {projects.map((p: Project) => (
                 <Link
                key={p.id}
                to={`/projects/${p.id}?from=my-projects`}
                className={cls.item}
              >
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
      </div>
    </div>
  );
}
