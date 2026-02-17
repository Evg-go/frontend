// Тип для даты в формате { year, month, day }
export type api_date = {
  year: number;
  month: number;
  day: number;
};

// Тип проекта для отображения на фронте (включая строки для статуса)
export type project = {
  id: string;
  team_id: string;
  creator_id: string;

  name: string;
  description: string;

  status: project_status;  // Строки: 'unspecified' | 'not_started' | 'in_progress' | 'done' | 'on_hold'
  is_open: boolean;

  started_at: string | null; // ISO: YYYY-MM-DD
  finished_at: string | null;

  created_at: string | null;
  updated_at: string | null;
};

// Тип публичного проекта (для списка публичных проектов)
export type project_public = {
  id: string;
  team_id: string;

  name: string;
  description: string;

  status: project_status;  // Строки: 'unspecified' | 'not_started' | 'in_progress' | 'done' | 'on_hold'
  is_open: boolean;

  started_at: string | null;
  finished_at: string | null;

  created_at: string | null;
};

// Параметры для запроса публичных проектов
export type list_public_projects_params = {
  query?: string;
  status?: project_status;  // Строка, например 'not_started', 'done', или 'unspecified'
  page_size?: number;
  page_token?: string;
};

// Ответ на запрос публичных проектов
export type list_public_projects_response = {
  projects: project_public[];
  next_page_token: string;
};

// Данные для создания нового проекта
export type create_project_body = {
  name: string;
  description?: string;
  status: project_status;  // Строка: 'unspecified' | 'not_started' | 'in_progress' | 'done' | 'on_hold'
  is_open: boolean;
  started_at: string; // ISO формат: YYYY-MM-DD
  finished_at?: string | null;
  team_name?: string;
};

// Статусы проекта для работы с бэком (числа)
export const project_status_number = {
  unspecified: 0,
  not_started: 1,
  in_progress: 2,
  done: 3,
  on_hold: 4,
} as const;

// Статусы проекта для фронта 
export const project_status = {
  unspecified: 'unspecified',
  not_started: 'not_started',
  in_progress: 'in_progress',
  done: 'done',
  on_hold: 'on_hold',
} as const;  

// Тип для статусов на фронте (строки)
export type project_status = keyof typeof project_status;  // 'unspecified' | 'not_started' | 'in_progress' | 'done' | 'on_hold'

// Функция для преобразования строки в число (для отправки на бэк)
export function project_status_to_number(status: project_status): number {
  return project_status_number[status];
}

// Функция для преобразования числа в строку (для отображения на фронте)
export function number_to_project_status(number: number): project_status {
  const status = Object.entries(project_status_number).find(([key, value]) => value === number);
  return status ? status[0] as project_status : 'unspecified';  // возвращает строку
}

export type project_rights = {
  manager_rights: boolean;
  manager_member: boolean;
  manager_projects: boolean;
  manager_tasks: boolean;
};

export type project_member = {
  project_id: string;
  user_id: string;
  rights: project_rights;
};

export type list_project_members_response = {
  members: project_member[];
  next_page_token: string;
};

export type add_project_member_body = {
  user_id: string;
  rights?: Partial<project_rights>;
};