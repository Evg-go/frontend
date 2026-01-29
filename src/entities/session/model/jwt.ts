export type JwtPayload = {
  exp?: number; // seconds since epoch
  iat?: number;
  sub?: string;

  // на будущее: удобно заложить, если сервер будет поддерживать kill all sessions
  token_version?: number;

  // поля из токена
  [key: string]: unknown;
};

function base64UrlToBase64(input: string) {
  // base64url -> base64
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const base64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  return base64;
}

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(base64UrlToBase64(payload));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, clockSkewSeconds = 30): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false; // если exp нет — считаем не истек, но лучше чтобы exp был

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + clockSkewSeconds;
}
