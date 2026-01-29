const LS_ACCESS = 'access_token';
const LS_EXP = 'access_expires_at';

export function saveTokens(access: string, exp: number) {
  localStorage.setItem(LS_ACCESS, access);
  localStorage.setItem(LS_EXP, String(exp));
}

export function clearTokens() {
  localStorage.removeItem(LS_ACCESS);
  localStorage.removeItem(LS_EXP);
}

export function getValidAccessToken(): string | null {
  const token = localStorage.getItem(LS_ACCESS);
  const expStr = localStorage.getItem(LS_EXP);
  if (!token || !expStr) return null;

  const exp = Number(expStr);
  const now = Math.floor(Date.now() / 1000);

  if (!Number.isFinite(exp) || now >= exp) {
    clearTokens();
    return null;
  }

  return token;
}

export function hasValidSession(): boolean {
  return getValidAccessToken() !== null;
}
