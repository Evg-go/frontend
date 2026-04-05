import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import cls from './ProjectsPage.module.css';

import { use_public_projects } from '@/entities/project/model/hooks';
import {
  project_skill_match_mode,
  project_sort_by,
  project_status,
  sort_order,
} from '@/entities/project/model/types';
import type {
  project_skill_match_mode as project_skill_match_mode_type,
  project_sort_by as project_sort_by_type,
  sort_order as sort_order_type,
} from '@/entities/project/model/types';
import type { Skill } from '@/entities/skill/model/types';
import { format_date } from '@/entities/project/lib/date';
import { project_status_label } from '@/entities/project/lib/status';
import { SkillsChips } from '@/entities/skill/ui/SkillsChips';
import { ProjectFiltersModal } from '@/features/project/filterProjects/ui/ProjectFiltersModal';

function get_skill_match_mode_label(value: project_skill_match_mode_type) {
  if (value === project_skill_match_mode.all) {
    return 'Все выбранные скиллы';
  }

  return 'Хотя бы один выбранный скилл';
}

function get_match_percent_tone(percent: number) {
  if (percent === 0) {
    return 'dark_red';
  }

  if (percent < 15) {
    return 'red';
  }

  if (percent <= 35) {
    return 'yellow';
  }

  return 'green';
}

export function ProjectsPage() {
  const [query, set_query] = useState('');
  const [status, set_status] = useState<project_status>(project_status.unspecified);

  const [is_filters_open, set_is_filters_open] = useState(false);
  const [applied_skills, set_applied_skills] = useState<Skill[]>([]);
  const [applied_skill_match_mode, set_applied_skill_match_mode] =
    useState<project_skill_match_mode_type>(project_skill_match_mode.any);

  const [sort_by, set_sort_by] =
    useState<project_sort_by_type>(project_sort_by.created_at);
  const [current_sort_order, set_current_sort_order] =
    useState<sort_order_type>(sort_order.desc);

  const applied_skill_ids = useMemo(
    () =>
      applied_skills
        .map((skill) => skill.id)
        .filter((id) => id !== '')
        .sort(),
    [applied_skills],
  );

  const params = useMemo(
    () => ({
      query,
      status,
      page_size: 10,
      skill_ids: applied_skill_ids,
      skill_match_mode:
        applied_skill_ids.length > 0
          ? applied_skill_match_mode
          : project_skill_match_mode.unspecified,
      sort_by,
      sort_order: current_sort_order,
    }),
    [
      query,
      status,
      applied_skill_ids,
      applied_skill_match_mode,
      sort_by,
      current_sort_order,
    ],
  );

  const q = use_public_projects(params);
  const projects = q.data?.pages.flatMap((page) => page.projects) ?? [];

  const on_apply_filters = (payload: {
    skills: Skill[];
    skill_match_mode: project_skill_match_mode_type;
  }) => {
    set_applied_skills(payload.skills);
    set_applied_skill_match_mode(payload.skill_match_mode);
    set_is_filters_open(false);
  };

  const on_reset_applied_filters = () => {
    set_applied_skills([]);
    set_applied_skill_match_mode(project_skill_match_mode.any);
  };

  return (
    <div className={cls.page}>
      <div className={cls.header}>
        <h3 className={cls.title}>Проекты</h3>
      </div>

      <div className={cls.card}>
        <div className={cls.filters_row}>
          <input
            className={cls.search_input}
            value={query}
            onChange={(event) => set_query(event.target.value)}
            placeholder="Поиск..."
          />

          <select
            className={cls.select}
            value={status}
            onChange={(event) => set_status(event.target.value as project_status)}
          >
            <option value={project_status.unspecified}>Любой статус</option>
            <option value={project_status.not_started}>NOT_STARTED</option>
            <option value={project_status.in_progress}>IN_PROGRESS</option>
            <option value={project_status.done}>DONE</option>
            <option value={project_status.on_hold}>ON_HOLD</option>
          </select>

          <select
            className={cls.select}
            value={sort_by}
            onChange={(event) => set_sort_by(event.target.value as project_sort_by_type)}
          >
            <option value={project_sort_by.created_at}>Сортировка: по созданию</option>
            <option value={project_sort_by.started_at}>Сортировка: по началу</option>
            <option value={project_sort_by.profile_skill_match}>
              Сортировка: по совпадению skills профиля
            </option>
          </select>

          <select
            className={cls.select}
            value={current_sort_order}
            onChange={(event) =>
              set_current_sort_order(event.target.value as sort_order_type)
            }
          >
            <option value={sort_order.desc}>По убыванию</option>
            <option value={sort_order.asc}>По возрастанию</option>
          </select>

          <button
            type="button"
            className={cls.secondary_button}
            onClick={() => set_is_filters_open(true)}
          >
            {applied_skills.length > 0
              ? `Фильтры: ${applied_skills.length}`
              : 'Фильтры'}
          </button>
        </div>

        {applied_skills.length > 0 && (
          <div className={cls.applied_filters}>
            <div className={cls.applied_filters_top}>
              <div className={cls.applied_filters_meta}>
                Режим совпадения: {get_skill_match_mode_label(applied_skill_match_mode)}
              </div>

              <button
                type="button"
                className={cls.clear_button}
                onClick={on_reset_applied_filters}
              >
                Очистить фильтр
              </button>
            </div>

            <SkillsChips
              title="Выбранные скиллы"
              skills={applied_skills}
              empty_text=""
              class_name={cls.applied_skills_block}
            />
          </div>
        )}

        {q.isLoading && <div>Загрузка...</div>}
        {q.isError && <div>Ошибка загрузки списка</div>}

        {!q.isLoading && !q.isError && projects.length === 0 && (
          <div>Ничего не найдено</div>
        )}

        {!q.isLoading && !q.isError && projects.length > 0 && (
          <div className={cls.items}>
            {projects.map((project_item) => {
              const started_at_text =
                project_item.status === project_status.not_started
                  ? '—'
                  : format_date(project_item.started_at);

              const match_percent = project_item.profile_skill_match_percent;
              const match_percent_tone =
                typeof match_percent === 'number'
                  ? get_match_percent_tone(match_percent)
                  : null;

              return (
                <Link
                  key={project_item.id}
                  to={`/projects/${project_item.id}`}
                  className={cls.item}
                >
                  <div className={cls.item_top}>
                    <div className={cls.item_title_wrap}>
                      <b className={cls.item_name}>{project_item.name}</b>

                      {typeof match_percent === 'number' && match_percent_tone && (
                        <span
                          className={`${cls.match_badge} ${
                            match_percent_tone === 'dark_red'
                              ? cls.match_badge_dark_red
                              : match_percent_tone === 'red'
                                ? cls.match_badge_red
                                : match_percent_tone === 'yellow'
                                  ? cls.match_badge_yellow
                                  : cls.match_badge_green
                          }`}
                        >
                          {match_percent}%
                        </span>
                      )}
                    </div>

                    <span>{project_status_label(project_item.status)}</span>
                  </div>

                  <div className={cls.itemDesc}>
                    {project_item.description || '—'}
                  </div>

                  <div className={cls.item_meta}>
                    <span>начат: {started_at_text}</span>
                    <span>создан: {format_date(project_item.created_at)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {q.hasNextPage && (
          <button
            type="button"
            className={cls.secondary_button}
            onClick={() => q.fetchNextPage()}
            disabled={q.isFetchingNextPage}
          >
            {q.isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
          </button>
        )}
      </div>

      <ProjectFiltersModal
        is_open={is_filters_open}
        initial_skills={applied_skills}
        initial_skill_match_mode={applied_skill_match_mode}
        on_close={() => set_is_filters_open(false)}
        on_apply={on_apply_filters}
      />
    </div>
  );
}