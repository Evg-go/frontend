import { useEffect, useMemo, useState } from 'react';

import { get_skill_key } from '@/entities/skill/lib/normalize_skills';
import { use_skill_search } from '@/entities/skill/model/hooks';
import type { Skill } from '@/entities/skill/model/types';

type Use_select_skills_params = {
  value: Skill[];
  on_change: (next_value: Skill[]) => void;
  limit?: number;
  page_size?: number;
  debounce_ms?: number;
};

export function use_select_skills({
  value,
  on_change,
  limit = 60,
  page_size = 10,
  debounce_ms = 300,
}: Use_select_skills_params) {
  const [query, set_query] = useState('');
  const [debounced_query, set_debounced_query] = useState('');

  useEffect(() => {
    const timer_id = window.setTimeout(() => {
      set_debounced_query(query.trim());
    }, debounce_ms);

    return () => {
      window.clearTimeout(timer_id);
    };
  }, [query, debounce_ms]);

  const selected_keys = useMemo(
    () => new Set(value.map((skill) => get_skill_key(skill))),
    [value],
  );

  const normalized_query = debounced_query.trim();

  const search_query = use_skill_search({
    query: normalized_query,
    enabled: normalized_query.length >= 2,
    page_size,
  });

  const available_skills = useMemo(() => {
    const skills = search_query.data?.skills ?? [];

    return skills.filter((skill) => !selected_keys.has(get_skill_key(skill)));
  }, [search_query.data?.skills, selected_keys]);

  const is_limit_reached = value.length >= limit;

  function add_skill(skill: Skill) {
    const skill_key = get_skill_key(skill);

    if (selected_keys.has(skill_key)) {
      return;
    }

    if (is_limit_reached) {
      return;
    }

    on_change([...value, skill]);
    set_query('');
    set_debounced_query('');
  }

  function remove_skill(skill: Skill) {
    const skill_key = get_skill_key(skill);

    on_change(value.filter((item) => get_skill_key(item) !== skill_key));
  }

  return {
    query,
    set_query,
    selected_skills: value,
    available_skills,
    add_skill,
    remove_skill,
    is_limit_reached,
    search_query,
    limit,
  };
}