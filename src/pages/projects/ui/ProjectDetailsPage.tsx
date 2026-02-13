import { Link, useParams } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { use_project } from '@/entities/project/model/hooks';
import { format_date } from '@/entities/project/lib/date';
import { project_status_label } from '@/entities/project/lib/status';

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project_id = projectId ?? '';

  const q = use_project(project_id);

  const status_code = (q.error as any)?.status ?? (q.error as any)?.status_code;
  const p: any = q.data;

  const status = project_status_label(p?.status);
  const isOpen = Boolean(p?.is_open ?? p?.isOpen);
  const startedRaw = format_date(p?.started_at ?? p?.startedAt);
  const finishedRaw = format_date(p?.finished_at ?? p?.finishedAt);

  const started = startedRaw === '—' ? '0000-00-00' : startedRaw;
  const finished = finishedRaw === '—' ? 'не закончен' : finishedRaw;

  const name = String(p?.name ?? '—');
  const description = String(p?.description ?? '—');
  const id = String(p?.id ?? '—');

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
                <div className={cls.datesLabel}>Started </div>
                <div className={cls.datesColon}>:</div>
                <div>{started}</div>

                <div className={cls.datesLabel}>Finished</div>
                <div className={cls.datesColon}>:</div>
                <div>{finished}</div>
              </div>
            </div>

            <h1 className={cls.name}>{name}</h1>
            <div className={cls.desc}>{description}</div>

            <div className={cls.meta}>
              <span style={{ opacity: 0.7 }}>ID проекта:</span> {id}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
