import { sessionModel } from '@/entities/session/model/session';
import { queryClient } from '@/app/providers'; // 

export function logout() {
  sessionModel.clearAccessToken();
  // чистим кэш, чтобы не показывать данные прошлого пользователя
  queryClient.clear();
}
