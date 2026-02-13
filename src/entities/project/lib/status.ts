export function project_status_label(v: unknown): string {
  const s = String(v ?? '');

  switch (s) {
    
    case 'PROJECT_STATUS_NOT_STARTED':
      return 'Не начат';
    case 'PROJECT_STATUS_IN_PROGRESS':
      return 'В работе';
    case 'PROJECT_STATUS_ON_HOLD':
      return 'Пауза';
    case 'PROJECT_STATUS_DONE':
      return 'Завершён';

    
    case 'PROJECT_STATUS_PLANNED':
      return 'Запланирован';
    case 'PROJECT_STATUS_ACTIVE':
      return 'В работе';
    case 'PROJECT_STATUS_PAUSED':
      return 'Пауза';
    case 'PROJECT_STATUS_ARCHIVED':
      return 'Архив';

    case 'PROJECT_STATUS_UNSPECIFIED':
    case '':
    case '0':
      return 'Не указан';

    // короткие варианты 
    case 'not_started':
    case 'NOT_STARTED':
      return 'Не начат';
    case 'in_progress':
    case 'IN_PROGRESS':
      return 'В работе';
    case 'on_hold':
    case 'ON_HOLD':
      return 'Пауза';
    case 'done':
    case 'DONE':
      return 'Завершён';

    default:
      return s;
  }
}
