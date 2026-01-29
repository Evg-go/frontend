import { isJwtExpired, parseJwtPayload } from './jwt';
import type { NormalizedTokens } from './tokens';

const ACCESS_TOKEN_KEY = 'access_token';
const ACCESS_EXPIRES_AT_KEY = 'access_expires_at';
const SESSION_ID_KEY = 'session_id';
const TOKEN_VERSION_KEY = 'token_version';

export const sessionModel = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  setTokens(tokens: NormalizedTokens) {
    // access-only
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

    if (tokens.accessExpiresAt) {
      localStorage.setItem(ACCESS_EXPIRES_AT_KEY, String(tokens.accessExpiresAt));
    } else {
      localStorage.removeItem(ACCESS_EXPIRES_AT_KEY);
    }

    if (tokens.sessionId) localStorage.setItem(SESSION_ID_KEY, tokens.sessionId);
    else localStorage.removeItem(SESSION_ID_KEY);

    if (tokens.tokenVersion !== undefined) localStorage.setItem(TOKEN_VERSION_KEY, String(tokens.tokenVersion));
    else localStorage.removeItem(TOKEN_VERSION_KEY);

    // refresh_token не сохраняем намеренно
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(ACCESS_EXPIRES_AT_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(TOKEN_VERSION_KEY);
  },

  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return `Bearer ${token}`;
  },

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    // если это JWT и есть exp - проверяем exp
    const payload = parseJwtPayload(token);
    if (payload?.exp) return !isJwtExpired(token);

    // если gateway/сервер кладет expires_at отдельно - проверим его
    const raw = localStorage.getItem(ACCESS_EXPIRES_AT_KEY);
    if (raw) {
      const exp = Number(raw);
      if (!Number.isNaN(exp)) {
        const now = Math.floor(Date.now() / 1000);
        return exp > now + 30;
      }
    }

    // иначе считаем валидным по наличию (временно)
    return true;
  },
};
