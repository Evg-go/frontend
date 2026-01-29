import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMe, type UpdateMeDto } from '@/entities/user/api/userApi';
import { userQueryKeys } from '@/entities/user/model/queryKeys';

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateMeDto) => updateMe(dto),
    onSuccess: (user) => {
      // обновляем кэш GetMe сразу
      qc.setQueryData(userQueryKeys.me(), user);
    },
  });
}
