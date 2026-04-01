import { useEffect, useMemo, useState } from 'react';

import cls from './editProjectSkillsForm.module.css';

import { are_skill_lists_equal } from '@/entities/skill/lib/normalize_skills';
import type { Skill } from '@/entities/skill/model/types';
import { use_update_project } from '@/entities/project/model/hooks';
import { SelectSkillsField } from '@/features/skill/selectSkills/ui/selectSkillsField';
import { toApiError } from '@/shared/api/errors';
import { Button } from '@/shared/ui/Button';

type Props = {
  project_id: string;
  initial_skills: Skill[];
  on_saved?: () => void;
  limit?: number;
};

export function EditProjectSkillsForm({
  project_id,
  initial_skills,
  on_saved,
  limit = 60,
}: Props) {
  const mutation = use_update_project();

  const [selected_skills, set_selected_skills] = useState<Skill[]>(initial_skills);
  const [error_message, set_error_message] = useState('');

  useEffect(() => {
    set_selected_skills(initial_skills);
  }, [initial_skills]);

  const is_changed = useMemo(
    () => !are_skill_lists_equal(selected_skills, initial_skills),
    [selected_skills, initial_skills],
  );

  async function on_submit() {
    try {
      set_error_message('');

      const skill_ids = selected_skills
        .map((skill) => skill.id)
        .filter((id) => id !== '');

      await mutation.mutateAsync({
        project_id,
        skills: {
          ids: skill_ids,
        },
      });

      on_saved?.();
    } catch (error) {
      const api_error = toApiError(error);
      set_error_message(api_error.message);
    }
  }

  return (
    <div className={cls.root}>
      <SelectSkillsField
        value={selected_skills}
        on_change={set_selected_skills}
        limit={limit}
        hide_header
        search_placeholder="Введите название скилла"
        empty_text="У проекта пока нет скиллов"
      />

      {error_message && <div className={cls.error}>{error_message}</div>}

      <div className={cls.actions}>
        <Button
          type="button"
          variant="primary"
          onClick={on_submit}
          disabled={mutation.isPending || !is_changed}
        >
          {mutation.isPending ? 'Сохранение...' : 'Сохранить скиллы'}
        </Button>
      </div>
    </div>
  );
}