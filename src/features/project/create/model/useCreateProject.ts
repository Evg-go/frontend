import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/entities/project/api/projectApi';
import { projectQueryKeys } from '@/entities/project/model/queryKeys';
import type { CreateProjectInput } from '@/entities/project/model/types';

export function useCreateProject(currentListParams?: Record<string, unknown>) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectInput) => createProject(dto),
    onSuccess: () => {
      // обновляем именно тот список, который сейчас на экране
      qc.invalidateQueries({ queryKey: projectQueryKeys.list(currentListParams as any) });
    },
  });
}
