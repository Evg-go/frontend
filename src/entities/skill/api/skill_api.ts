import { httpClient } from '@/shared/api/httpClient';

import type {
  List_skills_params,
  List_skills_response,
  Skill,
} from '../model/types';

type Skill_raw = {
  id?: unknown;
  skill_id?: unknown;
  name?: unknown;
  skill_name?: unknown;
};

type List_skills_response_raw = Record<string, unknown> & {
  skills?: unknown;
  next_page_token?: unknown;
  nextPageToken?: unknown;
};

function normalize_skill(raw: unknown): Skill {
  const data = (raw ?? {}) as Skill_raw;

  const id =
    typeof data.id === 'string'
      ? data.id
      : typeof data.skill_id === 'string'
        ? data.skill_id
        : '';

  const name =
    typeof data.name === 'string'
      ? data.name
      : typeof data.skill_name === 'string'
        ? data.skill_name
        : '';

  return {
    id,
    name,
  };
}

function normalize_list_skills_response(raw: unknown): List_skills_response {
  const data = (raw ?? {}) as List_skills_response_raw;

  const skills_raw = Array.isArray(data.skills) ? data.skills : [];

  const next_page_token =
    typeof data.next_page_token === 'string'
      ? data.next_page_token
      : typeof data.nextPageToken === 'string'
        ? data.nextPageToken
        : '';

  const skills = skills_raw
    .map(normalize_skill)
    .filter((skill) => skill.id !== '' && skill.name !== '');

  return {
    skills,
    next_page_token,
  };
}

export async function list_skills(
  params: List_skills_params = {},
): Promise<List_skills_response> {
  const response = await httpClient.get('/skills', {
    params: {
      query: params.query?.trim() || undefined,
      page_size: params.page_size ?? 10,
      page_token: params.page_token || undefined,
    },
  });

  return normalize_list_skills_response(response.data);
}