import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { create_project_payload } from '@/entities/project/api/types';

import type {
  create_project_body,
  list_public_projects_params,
  list_public_projects_response,
  project,
  project_public,
  project_status,
} from '@/entities/project/model/types';

import { api_date_to_iso, iso_to_api_date } from '@/entities/project/lib/date';
import { project_status_to_number, number_to_project_status } from '@/entities/project/model/types';

// Функция для нормализации статуса, если он приходит как число или строка
function normalize_project_status(v: unknown): project_status {
  if (typeof v === 'number') {
    switch (v) {
      case 1: return 'not_started';
      case 2: return 'in_progress';
      case 3: return 'done';
      case 4: return 'on_hold';
      default: return 'unspecified';
    }
  }

  if (typeof v === 'string') {
    const s = v.toUpperCase();

    if (s.endsWith('NOT_STARTED')) return 'not_started';
    if (s.endsWith('IN_PROGRESS')) return 'in_progress';
    if (s.endsWith('DONE')) return 'done';
    if (s.endsWith('ON_HOLD')) return 'on_hold';

    if (s.endsWith('UNSPECIFIED')) return 'unspecified';
  }

  return 'unspecified';
}

function map_project_public(raw: any): project_public {
  return {
    id: String(raw.id),
    team_id: String(raw.team_id),
    name: String(raw.name),
    description: String(raw.description ?? ''),
    status: normalize_project_status(raw.status),
    is_open: Boolean(raw.is_open),

    started_at: api_date_to_iso(raw.started_at),
    finished_at: api_date_to_iso(raw.finished_at),

    created_at: api_date_to_iso(raw.created_at),
  };
}

function map_project(raw: any): project {
  return {
    id: String(raw.id),
    team_id: String(raw.team_id),
    creator_id: String(raw.creator_id),

    name: String(raw.name),
    description: String(raw.description ?? ''),

    status: normalize_project_status(raw.status),
    is_open: Boolean(raw.is_open),

    started_at: api_date_to_iso(raw.started_at),
    finished_at: api_date_to_iso(raw.finished_at),

    created_at: api_date_to_iso(raw.created_at),
    updated_at: api_date_to_iso(raw.updated_at),
  };
}

export const project_api = {
  // Получение списка проектов с фильтрацией
  async list_public_projects(params: list_public_projects_params): Promise<list_public_projects_response> {
    const search = new URLSearchParams();

    if (params.query) search.set('query', params.query);

    // статус: если UNSPECIFIED/undefined => не шлем
    if (params.status && params.status !== 'unspecified') {
      // Передаем статус как число
      search.set('status', String(project_status_to_number(params.status)));
    }

    if (params.page_size) search.set('page_size', String(params.page_size));
    if (params.page_token) search.set('page_token', params.page_token);

    const url = `${endpoints.projects.projects_public}?${search.toString()}`;

     const res = await httpClient.get<list_public_projects_response>(url, { withCredentials: true });

    return {
     projects: Array.isArray(res.data.projects) ? res.data.projects.map(map_project_public) : [],
      next_page_token: String(res.data.next_page_token ?? ''),
    };
  },

  // Получение проекта по ID
  async get_project(project_id: string): Promise<project> {
    const res = await httpClient.get(endpoints.projects.project_by_id(project_id));
    return map_project(res.data);
  },

  async create_project(body: create_project_body): Promise<project> {
    // Формируем объект payload для отправки на бэк
    const payload: create_project_payload = {
      name: body.name,
      description: body.description ?? '',
      status: project_status_to_number(body.status),  // Конвертируем статус в число
      is_open: body.is_open,
      started_at: iso_to_api_date(body.started_at),
      finished_at: body.finished_at ? iso_to_api_date(body.finished_at) : undefined,
      team_name: body.team_name ?? '',
    };

    // Отправляем запрос на создание проекта
    const res = await httpClient.post(endpoints.projects.projects, payload);

    // Возвращаем полученные данные, преобразованные в нужный тип
    return map_project(res.data);
  },
};
