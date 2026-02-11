import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import cls from './ProjectsPage.module.css';

import { useProjects } from '@/entities/project/model/hooks';
import { ProjectStatus } from '@/entities/project/model/types';
import { CreateProjectForm } from '@/features/project/create/ui/CreateProjectForm';
import { formatDate } from '@/entities/project/lib/date';

export function ProjectsPage() {
  const navigate = useNavigate();

  const [teamId, setTeamId] = useState('');
  const [query, setQuery] = useState('');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.PROJECT_STATUS_UNSPECIFIED);

  const listParams = useMemo(
    () => ({
      teamId: teamId || undefined,
      query: query || undefined,
      onlyOpen,
      status,
      pageSize: 20,
    }),
    [teamId, query, onlyOpen, status],
  );

  const qList = useProjects(listParams);
  const projects = qList.data?.projects ?? [];
  const nextPageToken = qList.data?.nextPageToken;

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проекты</h3>
        <button onClick={() => qList.refetch()} disabled={qList.isFetching}>
          {qList.isFetching ? 'Обновляем...' : 'Обновить'}
        </button>
      </div>

      <div className={cls.card}>
        <h3 className={cls.title}>Фильтры</h3>
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          <Field label="Team ID">
            <input value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder="UUID команды" />
          </Field>

          <Field label="Поиск (query)">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="название/описание" />
          </Field>

          <Field label="Статус">
            <select value={status} onChange={(e) => setStatus(Number(e.target.value) as ProjectStatus)}>
              <option value={ProjectStatus.PROJECT_STATUS_UNSPECIFIED}>Any</option>
              <option value={ProjectStatus.PROJECT_STATUS_PLANNED}>PLANNED</option>
              <option value={ProjectStatus.PROJECT_STATUS_ACTIVE}>ACTIVE</option>
              <option value={ProjectStatus.PROJECT_STATUS_PAUSED}>PAUSED</option>
              <option value={ProjectStatus.PROJECT_STATUS_DONE}>DONE</option>
              <option value={ProjectStatus.PROJECT_STATUS_ARCHIVED}>ARCHIVED</option>
            </select>
          </Field>

          <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
            <span>Только открытые (only_open)</span>
          </label>

          {nextPageToken && <div style={{ color: 'var(--muted)' }}>next_page_token: {nextPageToken}</div>}
        </div>
      </div>

      <div className={cls.card}>
        <h3 className={cls.title}>Создать проект</h3>
        <div style={{ marginTop: 10 }}>
          <CreateProjectForm
            listParams={listParams as any}
            onCreated={(id) => {
              if (id) navigate(`/projects/${id}`);
              else qList.refetch();
            }}
          />
        </div>
      </div>

      <div className={cls.card}>
        <h3 className={cls.title}>Список</h3>

        {qList.isLoading && <div style={{ marginTop: 10 }}>Загрузка...</div>}
        {qList.isError && <div style={{ marginTop: 10 }}>Ошибка загрузки проектов</div>}

        {!qList.isLoading && !qList.isError && projects.length === 0 && (
          <div style={{ marginTop: 10, color: 'var(--muted)' }}>Пока проектов нет</div>
        )}

        {!qList.isLoading && !qList.isError && projects.length > 0 && (
          <div className={cls.list} style={{ marginTop: 10 }}>
            {projects.map((p) => (
              <div key={p.id} className={cls.item}>
                <div className={cls.itemTitle}>
                  <Link to={`/projects/${p.id}`}>{p.name || p.id}</Link>
                </div>

                <div className={cls.itemDesc}>
                  {p.description || '—'}
                </div>

                <div className={cls.itemDesc} style={{ marginTop: 8 }}>
                  Team: {p.teamId || '—'} • Open: {p.isOpen ? 'Yes' : 'No'} • Status: {p.status}
                  <br />
                  Started: {formatDate(p.startedAt)} • Finished: {formatDate(p.finishedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{props.label}</div>
      {props.children}
    </div>
  );
}
