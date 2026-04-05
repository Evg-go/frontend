import { useEffect, useState } from 'react';
import cls from './ProjectFiltersModal.module.css';

import { SelectSkillsField } from '@/features/skill/selectSkills/ui/selectSkillsField';
import { Button } from '@/shared/ui/Button';
import {
  project_skill_match_mode,
} from '@/entities/project/model/types';
import type {
  project_skill_match_mode as project_skill_match_mode_type,
} from '@/entities/project/model/types';
import type { Skill } from '@/entities/skill/model/types';

type Props = {
  is_open: boolean;
  initial_skills: Skill[];
  initial_skill_match_mode: project_skill_match_mode_type;
  on_close: () => void;
  on_apply: (payload: {
    skills: Skill[];
    skill_match_mode: project_skill_match_mode_type;
  }) => void;
  limit?: number;
};

export function ProjectFiltersModal({
  is_open,
  initial_skills,
  initial_skill_match_mode,
  on_close,
  on_apply,
  limit = 30,
}: Props) {
  const [draft_skills, set_draft_skills] = useState<Skill[]>(initial_skills);
  const [draft_skill_match_mode, set_draft_skill_match_mode] =
    useState<project_skill_match_mode_type>(initial_skill_match_mode);

  useEffect(() => {
    if (!is_open) return;

    set_draft_skills(initial_skills);
    set_draft_skill_match_mode(initial_skill_match_mode);
  }, [is_open, initial_skills, initial_skill_match_mode]);

  if (!is_open) {
    return null;
  }

  const on_apply_click = () => {
    on_apply({
      skills: draft_skills,
      skill_match_mode: draft_skill_match_mode,
    });
  };

  const on_reset_click = () => {
    set_draft_skills([]);
    set_draft_skill_match_mode(project_skill_match_mode.any);
  };

  return (
    <div className={cls.overlay} onClick={on_close}>
      <div
        className={cls.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={cls.header}>
          <div>
            <h3 className={cls.title}>Фильтры проектов</h3>
            <div className={cls.muted}>
              Выбери до {limit} скиллов и режим совпадения
            </div>
          </div>

          <button
            type="button"
            className={cls.close_button}
            onClick={on_close}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className={cls.section}>
          <div className={cls.section_title}>Режим совпадения</div>

          <div className={cls.match_mode_group}>
            <label className={cls.match_mode_option}>
              <input
                type="radio"
                name="skill_match_mode"
                value={project_skill_match_mode.any}
                checked={draft_skill_match_mode === project_skill_match_mode.any}
                onChange={() => set_draft_skill_match_mode(project_skill_match_mode.any)}
              />
              <span>Хотя бы один выбранный скилл</span>
            </label>

            <label className={cls.match_mode_option}>
              <input
                type="radio"
                name="skill_match_mode"
                value={project_skill_match_mode.all}
                checked={draft_skill_match_mode === project_skill_match_mode.all}
                onChange={() => set_draft_skill_match_mode(project_skill_match_mode.all)}
              />
              <span>Все выбранные скиллы</span>
            </label>
          </div>
        </div>

        <div className={cls.section}>
          <SelectSkillsField
            value={draft_skills}
            on_change={set_draft_skills}
            limit={limit}
            hide_header
            search_placeholder="Введите название скилла"
            empty_text="Скиллы для фильтра не выбраны"
          />
        </div>

        <div className={cls.footer}>
          <button
            type="button"
            className={cls.secondary_button}
            onClick={on_reset_click}
          >
            Сбросить
          </button>

          <div className={cls.footer_right}>
            <button
              type="button"
              className={cls.secondary_button}
              onClick={on_close}
            >
              Отмена
            </button>

            <Button
              type="button"
              variant="primary"
              onClick={on_apply_click}
            >
              Применить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}