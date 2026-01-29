export type NormalizedTokens = {
  accessToken: string;
  accessExpiresAt?: number; // unix seconds
  refreshToken?: string;
  refreshExpiresAt?: number;
  sessionId?: string;
  tokenVersion?: number;
};

function pick<T>(...vals: T[]): T | undefined {
  for (const v of vals) if (v !== undefined && v !== null) return v;
  return undefined;
}

export function normalizeTokenPair(input: unknown): NormalizedTokens | null {
  if (!input || typeof input !== 'object') return null;
  const t: any = input;

  const accessToken = pick<string>(t.accessToken, t.access_token);
  if (!accessToken) return null;

  return {
    accessToken,
    accessExpiresAt: pick<number>(t.accessExpiresAt, t.access_expires_at),
    refreshToken: pick<string>(t.refreshToken, t.refresh_token),
    refreshExpiresAt: pick<number>(t.refreshExpiresAt, t.refresh_expires_at),
    sessionId: pick<string>(t.sessionId, t.session_id),
    tokenVersion: pick<number>(t.tokenVersion, t.token_version),
  };
}
