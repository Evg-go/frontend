import type { api_date } from '@/entities/project/model/types';

function pad2(v: number) {
  return String(v).padStart(2, '0');
}

// Приводим дату к "YYYY-MM-DD" или возвращаем null.
// Поддерживает:
// - строку (YYYY-MM-DD или ISO datetime)
// - объект {year, month, day}
// - null/undefined
export function api_date_to_iso(v: unknown): string | null {
  if (!v) return null;

  // Строка: может быть "2026-05-01" или "2026-05-01T00:00:00Z"
  if (typeof v === 'string') {
    const m = /^(\d{4}-\d{2}-\d{2})/.exec(v);
    return m ? m[1] : v; // если не совпало
  }

  // Объект {year, month, day}
  if (typeof v === 'object') {
    const d = v as Partial<api_date>;
    if (!d.year || !d.month || !d.day) return null;
    return `${d.year}-${pad2(d.month)}-${pad2(d.day)}`;
  }

  return null;
}

export function iso_to_api_date(iso: string | null | undefined): api_date | undefined {
  if (!iso) return undefined;

  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return undefined;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (!year || !month || !day) return undefined;
  return { year, month, day };
}

export function format_date(v: unknown): string {
  return api_date_to_iso(v) ?? '—';
}
