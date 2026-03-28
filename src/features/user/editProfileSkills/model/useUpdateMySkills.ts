import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Skill } from '@/entities/skill/model/types';
import { httpClient } from '@/shared/api/httpClient';

type Update_my_skills_input = {
  skills: Skill[];
};

type Update_my_skills_payload = {
  skill_ids: string[];
  skills_set: boolean;
};

async function update_my_skills({
  skills,
}: Update_my_skills_input): Promise<unknown> {
  const unique_skill_ids = Array.from(
    new Set(
      skills
        .map((skill) => skill.id)
        .filter((skill_id): skill_id is string => typeof skill_id === 'string' && skill_id !== ''),
    ),
  );

  const payload: Update_my_skills_payload = {
    skill_ids: unique_skill_ids,
    skills_set: true,
  };

  const response = await httpClient.patch('/users/me', payload);

  return response.data;
}

export function use_update_my_skills() {
  const query_client = useQueryClient();

  return useMutation({
    mutationFn: update_my_skills,
    onSuccess: async () => {
      await query_client.invalidateQueries();
    },
  });
}