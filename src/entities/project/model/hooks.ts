import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { project_api } from '@/entities/project/api/projectApi';
import { project_query_keys, projectQueryKeys } from '@/entities/project/model/queryKeys';
import type { create_project_body, project_status } from '@/entities/project/model/types';
import { project_status as project_status_const } from '@/entities/project/model/types';
import { httpClient } from '@/shared/api/httpClient';
import { endpoints } from '@/shared/api/endpoints';

export function use_public_projects(params: { query: string; status: project_status; page_size: number }) {
  const status_for_key = params.status ?? project_status_const.unspecified;

  return useInfiniteQuery({
    queryKey: project_query_keys.public_list({ query: params.query, status: status_for_key }),
    initialPageParam: '',
    queryFn: ({ pageParam }) =>
      project_api.list_public_projects({
        query: params.query,
        status: status_for_key,
        page_size: params.page_size,
        page_token: pageParam ? String(pageParam) : undefined,
      }),
    getNextPageParam: (last_page) => (last_page.next_page_token ? last_page.next_page_token : undefined),
  });
}

export function use_project(project_id: string) {
  return useQuery({
    queryKey: ['projects', 'byId', project_id],
    queryFn: async () => {
      const res = await httpClient.get(endpoints.projects.project_by_id(project_id));
      return res.data;
    },
    enabled: Boolean(project_id),
    retry: false,
  });
}

export function use_create_project() {
  return useMutation({
    mutationFn: (body: create_project_body) => project_api.create_project(body),
  });
}

export function use_my_projects(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: projectQueryKeys.list(), 
    queryFn: async () => {
      const res = await httpClient.get(endpoints.projects.projects, {
        params: { query: '', page_size: 10 },  // Параметры для поиска
      });
      return res.data.projects;
    },
    enabled: opts?.enabled ?? true,
    retry: false,
  });
}