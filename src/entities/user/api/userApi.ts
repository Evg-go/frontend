import { httpClient } from '@/shared/api/httpClient';
import { endpoints } from '@/shared/api/endpoints';
import type { User } from '../model/types';

export async function getMe(): Promise<User> {
  const res = await httpClient.get<User>(endpoints.userProfile.me);
  return res.data;
}

export type UpdateMeDto = {
  first_name?: string;
  last_name?: string;
  phone?: string;
};

// Маппер: если кто-то передал camelCase, мы преобразуем в snake_case
function toUpdateMeDto(input: Partial<User> | UpdateMeDto): UpdateMeDto {
  const any = input as any;

  return {
    first_name: any.first_name ?? any.firstName,
    last_name: any.last_name ?? any.lastName,
    phone: any.phone,
  };
}


export async function updateMe(dto: Partial<User> | UpdateMeDto): Promise<User> {
  const payload = toUpdateMeDto(dto);
  const res = await httpClient.put<User>(endpoints.userProfile.updateMe, payload);
  return res.data;
}

