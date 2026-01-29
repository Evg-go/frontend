export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

export function toApiError(err: unknown): ApiError {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const anyErr = err as any;
    const status = anyErr.response?.status ?? 0;
    const data = anyErr.response?.data;

    return {
      status,
      message: (data && (data.message || data.error)) || anyErr.message || 'Request failed',
      details: data,
    };
  }

  if (err instanceof Error) {
    return { status: 0, message: err.message };
  }

  return { status: 0, message: 'Unknown error' };
}
