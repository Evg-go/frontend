import { useMemo, useState } from 'react';
import cls from './EditProfileSkillsForm.module.css';

import type { Skill } from '@/entities/skill/model/types';
import { use_skill_search } from '@/entities/skill/model/hooks';
import {
  are_skill_lists_equal,
  get_skill_key,
} from '@/entities/skill/lib/normalize_skills';
import { use_update_my_skills } from '../model/useUpdateMySkills';
import { use_debounce } from '@/shared/lib/navigation/hooks/use_debounce';

const max_skills = 30;

type Props = {
  initial_skills: Skill[];
  on_saved?: () => void;
};

export function EditProfileSkillsForm({
  initial_skills,
  on_saved,
}: Props) {
  const [selected_skills, set_selected_skills] = useState<Skill[]>(() => initial_skills);
  const [search, set_search] = useState('');

  const debounced_search = use_debounce(search, 350);
  const update_my_skills = use_update_my_skills();

  const limit_reached = selected_skills.length >= max_skills;
  const has_unsaved_changes = !are_skill_lists_equal(initial_skills, selected_skills);
  const has_skills_without_id = selected_skills.some((skill) => !skill.id);

  const search_query = use_skill_search({
    query: debounced_search,
    enabled: !limit_reached,
    page_size: 10,
  });

  const filtered_search_results = useMemo(() => {
    const selected_skill_ids = new Set(
      selected_skills
        .map((skill) => skill.id)
        .filter((skill_id) => skill_id !== ''),
    );

    const raw_results = search_query.data?.skills ?? [];

    return raw_results.filter((skill) => {
      if (!skill.id) return false;
      return !selected_skill_ids.has(skill.id);
    });
  }, [search_query.data?.skills, selected_skills]);

  const can_save =
    has_unsaved_changes &&
    !update_my_skills.isPending &&
    !has_skills_without_id;

  async function on_submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!can_save) return;

    await update_my_skills.mutateAsync({
      skills: selected_skills,
    });

    on_saved?.();
  }

  function on_remove_skill(skill_id: string) {
    set_selected_skills((current) =>
      current.filter((skill) => skill.id !== skill_id),
    );
  }

  function on_add_skill(skill: Skill) {
    if (limit_reached) return;

    set_selected_skills((current) => {
      const exists = current.some((item) => item.id === skill.id);
      if (exists) return current;

      return [...current, skill];
    });

    set_search('');
  }

  function on_reset_changes() {
    set_selected_skills(initial_skills);
    set_search('');
  }

  function on_search_key_down(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;

    if (filtered_search_results.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    on_add_skill(filtered_search_results[0]);
  }

  return (
    <form className={cls.form} onSubmit={on_submit}>
      <div className={cls.section}>
        <div className={cls.section_header}>
          <h2 className={cls.section_title}>Текущие скиллы</h2>
          <div className={cls.counter}>
            {selected_skills.length} / {max_skills}
          </div>
        </div>

        <div className={cls.section_hint}>
          Нажми на скилл, чтобы убрать его из профиля. Изменения отправятся только после нажатия кнопки «Сохранить».
        </div>

        {selected_skills.length === 0 ? (
          <div className={cls.empty_block}>Скиллы пока не выбраны</div>
        ) : (
          <div className={cls.skills_list}>
            {selected_skills.map((skill) => (
              <button
                key={get_skill_key(skill)}
                type="button"
                className={cls.skill_chip}
                onClick={() => on_remove_skill(skill.id)}
                disabled={update_my_skills.isPending}
                title="Убрать скилл"
              >
                <span>{skill.name}</span>
                <span className={cls.skill_chip_icon}>×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={cls.section}>
        <div className={cls.section_header}>
          <h2 className={cls.section_title}>Добавить скиллы</h2>
        </div>

        <div className={cls.section_hint}>
          Начни вводить название навыка. Поиск стартует от 2 символов.
        </div>

        <div className={cls.search_block}>
          <input
            value={search}
            onChange={(event) => set_search(event.target.value)}
            onKeyDown={on_search_key_down}
            className={cls.search_input}
            placeholder="Начните вводить название навыка"
            disabled={limit_reached || update_my_skills.isPending}
          />
        </div>

        {limit_reached ? (
          <div className={cls.info_message}>
            Достигнут лимит: максимум 30 навыков
          </div>
        ) : debounced_search.trim().length === 0 ? (
          <div className={cls.info_message}>
            Введите минимум 2 символа для поиска
          </div>
        ) : debounced_search.trim().length < 2 ? (
          <div className={cls.info_message}>
            Введите минимум 2 символа для поиска
          </div>
        ) : search_query.isLoading ? (
          <div className={cls.info_message}>Поиск...</div>
        ) : search_query.isError ? (
          <div className={cls.error_message}>Не удалось загрузить список навыков</div>
        ) : filtered_search_results.length === 0 ? (
          <div className={cls.info_message}>Навыки не найдены</div>
        ) : (
          <div className={cls.dropdown}>
            {filtered_search_results.map((skill) => (
              <button
                key={skill.id}
                type="button"
                className={cls.dropdown_item}
                onClick={() => on_add_skill(skill)}
                disabled={update_my_skills.isPending}
              >
                {skill.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {has_skills_without_id ? (
        <div className={cls.error_message}>
          Нельзя сохранить изменения: в текущем профиле есть скиллы без id. Для сохранения бэк должен возвращать id у навыков в GetMe.
        </div>
      ) : null}

      {update_my_skills.isError ? (
        <div className={cls.error_message}>
          {get_error_message(update_my_skills.error)}
        </div>
      ) : null}

      <div className={cls.actions}>
        <button
          type="button"
          className={cls.secondary_button}
          onClick={on_reset_changes}
          disabled={!has_unsaved_changes || update_my_skills.isPending}
        >
          Сбросить
        </button>

        <button
          type="submit"
          className={cls.primary_button}
          disabled={!can_save}
        >
          {update_my_skills.isPending ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

function get_error_message(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Не удалось сохранить изменения';
}