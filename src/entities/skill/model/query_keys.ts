export const skill_query_keys = {
  all: ['skills'] as const,

  lists: () => [...skill_query_keys.all, 'list'] as const,

  list: (params: {
    query?: string;
    page_size?: number;
    page_token?: string;
  }) =>
    [
      ...skill_query_keys.lists(),
      params.query ?? '',
      params.page_size ?? 10,
      params.page_token ?? '',
    ] as const,

  search: (query: string, page_size = 10) =>
    [...skill_query_keys.lists(), 'search', query, page_size] as const,
};