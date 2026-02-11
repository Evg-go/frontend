import type { DateMessage } from '../model/types';

export function parseDateInput(value: string): DateMessage | undefined {
  // ожидаем YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return undefined;

  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  return { year, month, day };
}

export function formatDate(d?: DateMessage): string {
  if (!d) return '';
  const mm = String(d.month).padStart(2, '0');
  const dd = String(d.day).padStart(2, '0');
  return `${d.year}-${mm}-${dd}`;
}
