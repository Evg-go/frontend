import { Link, useParams, useSearchParams } from 'react-router-dom';
import cls from './ProjectsPage.module.css';
import type { project } from '@/entities/project/model/types';

import {
  use_my_projects,
  use_project,
  use_request_join_project,
} from '@/entities/project/model/hooks';
import { format_date } from '@/entities/project/lib/date';
import { project_status_label } from '@/entities/project/lib/status';
import { SkillsChips } from '@/entities/skill/ui/SkillsChips';


export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const project_id = projectId ?? '';
  const [search_params] = useSearchParams();

  const q = use_project(project_id);
  const { data: my_projects } = use_my_projects({ enabled: true });
  const join_mutation = use_request_join_project(project_id);

  const error_data = q.error as { status?: number; status_code?: number } | null;
  const status_code = error_data?.status ?? error_data?.status_code;
  const p = q.data as project | undefined;

  const status = project_status_label(p?.status);
  const is_open = Boolean(p?.is_open);
  const started_raw = format_date(p?.started_at);
  const finished_raw = format_date(p?.finished_at);

  const started = started_raw === '—' ? '0000-00-00' : started_raw;
  const finished = finished_raw === '—' ? 'не закончен' : finished_raw;

  const name = String(p?.name ?? '—');
  const description = String(p?.description ?? '—');
  const id = String(p?.id ?? '—');

  const project_skills = p?.skills ?? [];

  const is_from_my_projects_page = search_params.get('from') === 'my-projects';
  const is_user_project = Boolean(
    my_projects?.some((project: { id: string }) => project.id === project_id),
  );
  const can_edit_project = is_from_my_projects_page && is_user_project;

  const can_join_project =
    Boolean(project_id) &&
    !is_user_project &&
    (q.isError ? status_code === 403 : is_open);

  const on_join_click = async () => {
    try {
      await join_mutation.mutateAsync();
    } catch {
      //
    }
  };

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

                <div className={`${cls.badge} ${is_open ? cls.badgeGreen : cls.badgeRed}`}>
                  <span>{is_open ? 'Открыт для участия' : 'Закрыт для участия'}</span>
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
            
            <SkillsChips
              title="Скиллы проекта"
              skills={project_skills}
              empty_text="Для проекта скиллы не указаны"
            />

            {can_edit_project && (
              <div className={cls.editButton}>
                <Link to={`/projects/edit/${p.id}`} className={cls.editButtonLink}>
                  Изменить проект
                </Link>
              </div>
            )}
          </>
        )}

        {can_join_project && (
          <div className={cls.joinButtonWrap}>
            <button
              type="button"
              className={cls.joinButton}
              onClick={on_join_click}
              disabled={join_mutation.isPending || join_mutation.isSuccess}
            >
              {join_mutation.isSuccess
                ? 'Заявка отправлена'
                : join_mutation.isPending
                  ? 'Отправляю...'
                  : 'Вступить'}
            </button>

            {join_mutation.isError ? (
              <div className={cls.joinButtonError}>Не удалось отправить заявку</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}