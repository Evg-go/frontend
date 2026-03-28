import { useQuery } from '@tanstack/react-query';

import { list_skills } from '../api/skill_api';
import { skill_query_keys } from './query_keys';

type Use_skill_search_params = {
  query: string;
  enabled?: boolean;
  page_size?: number;
};

export function use_skill_search({
  query,
  enabled = true,
  page_size = 10,
}: Use_skill_search_params) {
  const normalized_query = query.trim();
  const is_enabled = enabled && normalized_query.length >= 2;

  return useQuery({
    queryKey: skill_query_keys.search(normalized_query, page_size),
    queryFn: () =>
      list_skills({
        query: normalized_query,
        page_size,
      }),
    enabled: is_enabled,
    staleTime: 60_000,
  });
}