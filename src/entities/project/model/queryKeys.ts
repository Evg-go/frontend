export const project_query_keys = {
  root: ['projects'] as const,

  public_list: (params: { query: string; status: string }) =>
    [...project_query_keys.root, 'public', params] as const,

  by_id: (project_id: string) =>
    [...project_query_keys.root, 'by_id', project_id] as const,
};


export const projectQueryKeys = {
  list: () => ['projects', 'list'] as const, 
  byId: (id: string) => ['projects', 'byId', id] as const,
   project: (project_id: string) => ['project', project_id] as const,
  project_members: (project_id: string) => ['project', project_id, 'members'] as const,
};