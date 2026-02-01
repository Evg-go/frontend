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

  about?: string;
  is_user_open_suggestions?: boolean;
  is_profile_hidden?: boolean;
};


function toUpdateMeDto(input: Partial<User> | UpdateMeDto): UpdateMeDto {
  const any = input as any;

  return {
    first_name: any.first_name,
    last_name: any.last_name ,
    phone: any.phone,

    about: any.about,
    is_user_open_suggestions: any.is_user_open_suggestions,
    is_profile_hidden: any.is_profile_hidden,
  };
}


export async function updateMe(dto: Partial<User> | UpdateMeDto): Promise<User> {
  const payload = toUpdateMeDto(dto);
  const res = await httpClient.patch<User>(endpoints.userProfile.updateMe, payload);
  return res.data;
}

