import { httpClient } from '@/shared/api/httpClient';
import { endpoints } from '@/shared/api/endpoints';

export type RegisterRequestDto = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

export type RegisterResponseDto = {
  status: string; 
};

export async function register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
  const { data } = await httpClient.post<RegisterResponseDto>(endpoints.auth.register, dto);
  return data;
}
