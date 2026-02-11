export const projectQueryKeys = {
  list: (params?: Record<string, unknown>) => ['projects', 'list', params ?? {}] as const,
  byId: (id: string) => ['projects', 'byId', id] as const,
};