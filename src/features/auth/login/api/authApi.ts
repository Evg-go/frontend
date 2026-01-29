import { httpClient } from '@/shared/api/httpClient';
import { endpoints } from '@/shared/api/endpoints';
import { saveTokens } from '@/entities/session/model/authStorage';

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type LoginResponseDto = {
  tokens: {
    access_token: string;
    access_expires_at: number;
  };
};

export async function login(dto: LoginRequestDto): Promise<void> {
  const { data } = await httpClient.post<LoginResponseDto>(endpoints.auth.login, dto);
  saveTokens(data.tokens.access_token, data.tokens.access_expires_at);
}

