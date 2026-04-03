import { endpoints } from '@/shared/api/endpoints';
import { httpClient } from '@/shared/api/httpClient';
import type {
  create_project_payload,
  update_project_payload,
} from '@/entities/project/api/types';

import type {
  add_project_member_body,
  create_project_body,
  list_project_members_response,
  list_public_projects_params,
  list_public_projects_response,
  project,
  project_member,
  project_public,
  project_rights,
  project_skill,
  project_status,
} from '@/entities/project/model/types';

import { api_date_to_iso, iso_to_api_date } from '@/entities/project/lib/date';
import { project_status_to_number } from '@/entities/project/model/types';

function normalize_project_status(value: unknown): project_status {
  if (typeof value === 'number') {
    switch (value) {
      case 1:
        return 'not_started';
      case 2:
        return 'in_progress';
      case 3:
        return 'done';
      case 4:
        return 'on_hold';
      default:
        return 'unspecified';
    }
  }

  if (typeof value === 'string') {
    const status = value.toUpperCase();

    if (status.endsWith('NOT_STARTED')) return 'not_started';
    if (status.endsWith('IN_PROGRESS')) return 'in_progress';
    if (status.endsWith('DONE')) return 'done';
    if (status.endsWith('ON_HOLD')) return 'on_hold';
    if (status.endsWith('UNSPECIFIED')) return 'unspecified';
  }

  return 'unspecified';
}

function normalize_skill_ids(raw_skill_ids: unknown): string[] {
  if (!Array.isArray(raw_skill_ids)) {
    return [];
  }

  return raw_skill_ids
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize_project_skills(raw_skills: unknown): project_skill[] {
  if (!Array.isArray(raw_skills)) {
    return [];
  }

  return raw_skills
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const skill = item as Record<string, unknown>;
      const id = typeof skill.id === 'string' ? skill.id.trim() : '';
      const name = typeof skill.name === 'string' ? skill.name.trim() : '';

      if (!id || !name) {
        return null;
      }

      return {
        id,
        name,
      };
    })
    .filter((item): item is project_skill => item !== null);
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
    skill_ids: normalize_skill_ids(raw.skill_ids),
    skills: normalize_project_skills(raw.skills),
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
    skill_ids: normalize_skill_ids(raw.skill_ids),
    skills: normalize_project_skills(raw.skills),
  };
}

export const project_api = {
  async list_public_projects(
    params: list_public_projects_params,
  ): Promise<list_public_projects_response> {
    const search = new URLSearchParams();

    if (params.query) {
      search.set('query', params.query);
    }

    if (params.status && params.status !== 'unspecified') {
      search.set('status', String(project_status_to_number(params.status)));
    }

    if (params.page_size) {
      search.set('page_size', String(params.page_size));
    }

    if (params.page_token) {
      search.set('page_token', params.page_token);
    }

    const url = `${endpoints.projects.projects_public}?${search.toString()}`;
    const res = await httpClient.get(url, { withCredentials: true });
    const data = res.data ?? {};

    return {
      projects: Array.isArray(data.projects) ? data.projects.map(map_project_public) : [],
      next_page_token: String(data.next_page_token ?? ''),
    };
  },

  async get_project(project_id: string): Promise<project> {
    const res = await httpClient.get(endpoints.projects.project_by_id(project_id));
    console.log('get_project raw', res.data);
    return map_project(res.data);
  },

  async create_project(body: create_project_body): Promise<project> {
    const payload: create_project_payload = {
      name: body.name,
      description: body.description ?? '',
      status: project_status_to_number(body.status),
      is_open: body.is_open,
      started_at: iso_to_api_date(body.started_at),
      finished_at: body.finished_at ? iso_to_api_date(body.finished_at) : undefined,
      team_name: body.team_name ?? '',
    };

    const res = await httpClient.post(endpoints.projects.projects, payload);
    return map_project(res.data);
  },

  async update_project(body: update_project_payload) {
    const payload: Record<string, unknown> = {};

    if (body.name !== undefined) {
      payload.name = body.name;
    }

    if (body.description !== undefined) {
      payload.description = body.description;
    }

    if (body.status !== undefined) {
      payload.status = body.status;
    }

    if (body.is_open !== undefined) {
      payload.is_open = body.is_open;
    }

    if (body.started_at !== undefined) {
      payload.started_at = body.started_at;
    }

    if (body.finished_at !== undefined) {
      payload.finished_at = body.finished_at;
    }

    if (body.skills !== undefined) {
      payload.skills = {
        ids: body.skills.ids,
      };
    }

    const res = await httpClient.patch(
      endpoints.projects.update(body.project_id),
      payload,
    );

    return res.data;
  },

  async list_project_members(
    project_id: string,
    params?: { page_size?: number; page_token?: string },
  ): Promise<list_project_members_response> {
    const res = await httpClient.get(endpoints.projects.project_members(project_id), {
      params,
    });

    const data = res.data ?? {};

    return {
      members: Array.isArray(data.members) ? data.members.map(map_project_member) : [],
      next_page_token: String(data.next_page_token ?? ''),
    };
  },

  async add_project_member(
    project_id: string,
    body: add_project_member_body,
  ): Promise<project_member> {
    const payload = {
      user_id: body.user_id,
      rights: normalize_project_rights(body.rights),
    };

    const res = await httpClient.post(
      endpoints.projects.project_members(project_id),
      payload,
    );

    return map_project_member(res.data);
  },

  async request_join_project(project_id: string): Promise<void> {
    const payload = {
      message: 'Хочу вступить в проект',
    };

    await httpClient.post(endpoints.projects.project_join_requests(project_id), payload);
  },
};

function normalize_project_rights(
  input_rights: Partial<project_rights> | undefined,
): project_rights {
  return {
    manager_rights: Boolean(input_rights?.manager_rights),
    manager_member: Boolean(input_rights?.manager_member),
    manager_projects: Boolean(input_rights?.manager_projects),
    manager_tasks: Boolean(input_rights?.manager_tasks),
  };
}

function map_project_member(data: any): project_member {
  return {
    project_id: String(data.project_id ?? ''),
    user_id: String(data.user_id ?? ''),
    rights: normalize_project_rights(data.rights),
  };
}