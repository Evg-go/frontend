import cls from './select_skills_field.module.css';

import { get_skill_key } from '@/entities/skill/lib/normalize_skills';
import type { Skill } from '@/entities/skill/model/types';
import { use_select_skills } from '@/features/skill/selectSkills/model/useSelectSkills';

type Props = {
  value: Skill[];
  on_change: (next_value: Skill[]) => void;
  title?: string;
  description?: string;
  search_placeholder?: string;
  empty_text?: string;
  limit?: number;
};

export function SelectSkillsField({
  value,
  on_change,
  title = 'Скиллы',
  description = 'Добавьте нужные скиллы через поиск. Можно удалить любой выбранный скилл по нажатию на chip.',
  search_placeholder = 'Начните вводить название скилла',
  empty_text = 'Скиллы пока не выбраны',
  limit = 60,
}: Props) {
  const {
    query,
    set_query,
    selected_skills,
    available_skills,
    add_skill,
    remove_skill,
    is_limit_reached,
    search_query,
  } = use_select_skills({
    value,
    on_change,
    limit,
  });

  const is_short_query = query.trim().length > 0 && query.trim().length < 2;

  const show_empty_search_result =
    query.trim().length >= 2 &&
    !search_query.isLoading &&
    !search_query.isError &&
    available_skills.length === 0;

  return (
    <div className={cls.root}>
      <div className={cls.header}>
        <h3 className={cls.title}>{title}</h3>
        <div className={cls.muted}>{description}</div>
      </div>

      <div className={cls.panel}>
        <div className={cls.search_block}>
          <input
            className={cls.search_input}
            value={query}
            onChange={(event) => set_query(event.target.value)}
            placeholder={search_placeholder}
          />

          <div className={cls.info_row}>
            <div className={cls.hint}>
              Выбрано: {selected_skills.length} / {limit}
            </div>

            {is_limit_reached && (
              <div className={cls.hint}>Достигнут лимит по количеству скиллов</div>
            )}
          </div>

          {is_short_query && (
            <div className={cls.hint}>Введите минимум 2 символа для поиска</div>
          )}

          {search_query.isLoading && <div className={cls.hint}>Поиск скиллов...</div>}

          {search_query.isError && (
            <div className={cls.error}>Не удалось загрузить список скиллов</div>
          )}

          {available_skills.length > 0 && (
            <div className={cls.search_results}>
              {available_skills.map((skill) => (
                <button
                  key={get_skill_key(skill)}
                  type="button"
                  className={cls.result_button}
                  onClick={() => add_skill(skill)}
                  disabled={is_limit_reached}
                >
                  <span className={cls.result_name}>{skill.name}</span>
                  <span className={cls.result_action}>Добавить</span>
                </button>
              ))}
            </div>
          )}

          {show_empty_search_result && (
            <div className={cls.hint}>По этому запросу ничего не найдено</div>
          )}
        </div>
      </div>

      <div className={cls.panel}>
        <div className={cls.selected_block}>
          <div className={cls.selected_title}>Выбранные скиллы</div>

          {selected_skills.length === 0 ? (
            <div className={cls.empty}>{empty_text}</div>
          ) : (
            <div className={cls.skills_list}>
              {selected_skills.map((skill) => (
                <div key={get_skill_key(skill)} className={cls.skill_chip}>
                  <span className={cls.skill_name}>{skill.name}</span>

                  <button
                    type="button"
                    className={cls.remove_button}
                    onClick={() => remove_skill(skill)}
                    aria-label={`Удалить ${skill.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}