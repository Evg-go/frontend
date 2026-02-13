export const project_query_keys = {
  root: ['projects'] as const,

  public_list: (params: { query: string; status: string }) =>
    [...project_query_keys.root, 'public', params] as const,

  by_id: (project_id: string) =>
    [...project_query_keys.root, 'by_id', project_id] as const,
};