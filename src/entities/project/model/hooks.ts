import { useQuery } from '@tanstack/react-query';
import { getProjectById, listProjects } from '../api/projectApi';
import { projectQueryKeys } from './queryKeys';
import type { ListProjectsParams } from './types';

export function useProjects(params: ListProjectsParams) {
  return useQuery({
    queryKey: projectQueryKeys.list(params as any),
    queryFn: () => listProjects(params),
    retry: false,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectQueryKeys.byId(id),
    queryFn: () => getProjectById(id),
    enabled: Boolean(id),
    retry: false,
  });
}
