import type { project_skill_match_mode, project_sort_by, project_status, sort_order } from "./types";

export const project_query_keys = {
  root: ['projects'] as const,

public_list: (params: {
  query: string;
  status: project_status;
  skill_ids?: string[];
  skill_match_mode?: project_skill_match_mode;
  sort_by?: project_sort_by;
  sort_order?: sort_order;
  page_size?: number;
}) => ['projects', 'public_list', params] as const,

  by_id: (project_id: string) =>
    [...project_query_keys.root, 'by_id', project_id] as const,
};


export const projectQueryKeys = {
  list: () => ['projects', 'list'] as const, 
  byId: (id: string) => ['projects', 'byId', id] as const,
  project: (project_id: string) => ['project', project_id] as const,
  project_members: (project_id: string) => ['project', project_id, 'members'] as const,
};