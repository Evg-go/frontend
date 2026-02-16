import { Link, useParams, useSearchParams } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import {  use_my_projects, use_project  } from '@/entities/project/model/hooks';
import { format_date } from '@/entities/project/lib/date';
import { project_status_label } from '@/entities/project/lib/status';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project_id = projectId ?? '';
 const [searchParams] = useSearchParams();
  const q = use_project(project_id);

  const { data: my_projects } = use_my_projects({ enabled: true });

  const error_data = q.error as { status?: number; status_code?: number } | null;
  const status_code = error_data?.status ?? error_data?.status_code;
  const p = q.data as Record<string, unknown> | undefined;

  const status = project_status_label(p?.status);
  const isOpen = Boolean(p?.is_open ?? p?.isOpen);
  const startedRaw = format_date(p?.started_at ?? p?.startedAt);
  const finishedRaw = format_date(p?.finished_at ?? p?.finishedAt);

  const started = startedRaw === '—' ? '0000-00-00' : startedRaw;
  const finished = finishedRaw === '—' ? 'не закончен' : finishedRaw;

  const name = String(p?.name ?? '—');
  const description = String(p?.description ?? '—');
  const id = String(p?.id ?? '—');

  const is_from_my_projects_page = searchParams.get('from') === 'my-projects';
  const is_user_project = Boolean(my_projects?.some((project: { id: string }) => project.id === project_id));
  const can_edit_project = is_from_my_projects_page && is_user_project;

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проект</h3>
        <Link to="/projects">← Назад</Link>
      </div>

      <div className={cls.detailsCard}>
        {q.isLoading && <div>Загрузка...</div>}

        {q.isError && status_code === 403 && (
          <div>
            Нет доступа: проект закрытый, и вы не участник. <br />
            (позже сюда добавим кнопку “Подать заявку на вступление”)
          </div>
        )}

        {q.isError && status_code !== 403 && <div>Ошибка загрузки проекта</div>}

        {!q.isLoading && !q.isError && p && (
          <>
            <div className={cls.detailsTop}>
              <div className={cls.badges}>
                <div className={cls.badge}>
                  <span className={cls.badgeLabel}>Статус:</span>
                  <span>{status}</span>
                </div>

                <div className={`${cls.badge} ${isOpen ? cls.badgeGreen : cls.badgeRed}`}>
                  <span>{isOpen ? 'Открыт для участия' : 'Закрыт для участия'}</span>
                </div>
              </div>

              <div className={cls.dates}>
                <div className={cls.datesLabel}>Начало</div>
                <div className={cls.datesColon}> :</div>
                <div>{started}</div>

                <div className={cls.datesLabel}>Закончен</div>
                <div className={cls.datesColon}> :</div>
                <div>{finished}</div>
              </div>
            </div>

            <h1 className={cls.name}>{name}</h1>
            <div className={cls.desc}>{description}</div>

            <div className={cls.meta}>
              <span style={{ opacity: 0.7 }}>ID проекта:</span> {id}
            </div>

             {can_edit_project && (
              <div className={cls.editButton}>
                <Link to={`/projects/edit/${p.id}`} className={cls.editButtonLink}>
                  Изменить проект
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
