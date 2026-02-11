import { httpClient } from '@/shared/api/httpClient';
import { endpoints } from '@/shared/api/endpoints';
import type {
  CreateProjectInput,
  DateMessage,
  ListProjectsParams,
  Project,
} from '../model/types';
import type { ProjectStatus as ProjectStatusType } from '../model/types';
import { ProjectStatus } from '../model/types';

type TimestampWire =
  | string
  | { seconds?: number | string; nanos?: number }
  | null
  | undefined;

type DateWire =
  | { year?: number; month?: number; day?: number }
  | null
  | undefined;

type ProjectWire = {
  id?: string;

  team_id?: string;

  creator_id?: string;

  name?: string;


  status?: number | string;
  is_open?: boolean;

  started_at?: DateWire;

  finished_at?: DateWire;

  created_at?: TimestampWire;

  updated_at?: TimestampWire;

  [key: string]: unknown;
};

type ListProjectsResponseWire = {
  projects?: ProjectWire[];
  next_page_token?: string;

  [key: string]: unknown;
};

function normalizeTimestamp(ts: TimestampWire): string | undefined {
  if (!ts) return undefined;

  if (typeof ts === 'string') return ts;

  const secRaw = ts.seconds;
  if (secRaw === undefined || secRaw === null) return undefined;

  const sec = typeof secRaw === 'string' ? Number(secRaw) : secRaw;
  if (!Number.isFinite(sec)) return undefined;

  const d = new Date(sec * 1000);
  return d.toISOString();
}

function normalizeDate(d: DateWire): DateMessage | undefined {
  if (!d) return undefined;
  const year = Number(d.year ?? 0);
  const month = Number(d.month ?? 0);
  const day = Number(d.day ?? 0);

  if (!year || !month || !day) return undefined;
  return { year, month, day };
}

function parseProjectStatus(v: unknown): ProjectStatusType {

  if (typeof v === 'number') {
    switch (v) {
      case ProjectStatus.PROJECT_STATUS_UNSPECIFIED:
      case ProjectStatus.PROJECT_STATUS_PLANNED:
      case ProjectStatus.PROJECT_STATUS_ACTIVE:
      case ProjectStatus.PROJECT_STATUS_PAUSED:
      case ProjectStatus.PROJECT_STATUS_DONE:
      case ProjectStatus.PROJECT_STATUS_ARCHIVED:
        return v;
      default:
        return ProjectStatus.PROJECT_STATUS_UNSPECIFIED;
    }
  }

  if (typeof v === 'string') {
    switch (v) {
      case 'PROJECT_STATUS_PLANNED':
        return ProjectStatus.PROJECT_STATUS_PLANNED;
      case 'PROJECT_STATUS_ACTIVE':
        return ProjectStatus.PROJECT_STATUS_ACTIVE;
      case 'PROJECT_STATUS_PAUSED':
        return ProjectStatus.PROJECT_STATUS_PAUSED;
      case 'PROJECT_STATUS_DONE':
        return ProjectStatus.PROJECT_STATUS_DONE;
      case 'PROJECT_STATUS_ARCHIVED':
        return ProjectStatus.PROJECT_STATUS_ARCHIVED;
      case 'PROJECT_STATUS_UNSPECIFIED':
      default:
        return ProjectStatus.PROJECT_STATUS_UNSPECIFIED;
    }
  }

  return ProjectStatus.PROJECT_STATUS_UNSPECIFIED;
}

function fromWireProject(p: ProjectWire): Project {
  const id = String(p.id ?? '');

  const teamId = String(p.team_id ?? '');
  const creatorId = String(p.creator_id ?? '');

  const name = String(p.name ?? '');
  const description = String(p.description ?? '');

  const isOpen = p.is_open ?? false;

  const startedAt = normalizeDate((p.started_at) as DateWire);
  const finishedAt = normalizeDate((p.finished_at) as DateWire);

  const createdAt = normalizeTimestamp((p.created_at) as TimestampWire);
  const updatedAt = normalizeTimestamp((p.updated_at) as TimestampWire);

  const status = parseProjectStatus(p.status);

  return {
  ...p,
    id,
    teamId,
    creatorId,
    name,
    description,
    status,
    isOpen,

    startedAt,
    finishedAt,

    createdAt,
    updatedAt,
  };
}


export async function listProjects(params?: ListProjectsParams): Promise<{
  projects: Project[];
  nextPageToken?: string;
}> {
  const queryParams: Record<string, any> = {
    team_id: params?.teamId ?? '',
    creator_id: params?.creatorId ?? '',
    status: params?.status ?? 0,
    only_open: params?.onlyOpen ?? false,
    query: params?.query ?? '',
    page_size: params?.pageSize ?? 20,
    page_token: params?.pageToken ?? '',
  };

  // убираем пустые строки, чтобы не засорять query
  Object.keys(queryParams).forEach((k) => {
    if (queryParams[k] === '') delete queryParams[k];
  });

  const res = await httpClient.get<ListProjectsResponseWire>(endpoints.projects.list, {
    params: queryParams,
  });

  const data = res.data ?? {};
  const items = Array.isArray(data.projects) ? data.projects : [];
  const nextPageToken = data.next_page_token ?? data.nextPageToken;

  return {
    projects: items.map(fromWireProject),
    nextPageToken: nextPageToken ? String(nextPageToken) : undefined,
  };
}

export async function getProjectById(projectId: string): Promise<Project> {
  const res = await httpClient.get<ProjectWire>(endpoints.projects.byId(projectId));
  return fromWireProject(res.data ?? {});
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  // CreateProjectRequest по proto:
  // team_id, creator_id (лучше из ctx), name, description, status, is_open, started_at, finished_at

  const body: Record<string, any> = {
    team_id: input.teamId,
    name: input.name,
    description: input.description ?? '',
    status: input.status ?? 0,
    is_open: input.isOpen ?? true,
  };

  if (input.startedAt) body.started_at = input.startedAt;
  if (input.finishedAt) body.finished_at = input.finishedAt;

  const res = await httpClient.post<ProjectWire>(endpoints.projects.create, body);
  return fromWireProject(res.data ?? {});
}
