export type DateMessage = {
  year: number;  // e.g. 2026
  month: number; // 1..12
  day: number;   // 1..31
};

export const ProjectStatus = {
  PROJECT_STATUS_UNSPECIFIED: 0,
  PROJECT_STATUS_PLANNED: 1,
  PROJECT_STATUS_ACTIVE: 2,
  PROJECT_STATUS_PAUSED: 3,
  PROJECT_STATUS_DONE: 4,
  PROJECT_STATUS_ARCHIVED: 5,
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type Project = {
  id: string;

  teamId: string;
  creatorId: string;

  name: string;
  description: string;

  status: ProjectStatus;
  isOpen: boolean;

  startedAt?: DateMessage;
  finishedAt?: DateMessage;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
};

export type ListProjectsParams = {
  teamId?: string;
  creatorId?: string;

  status?: ProjectStatus; // 0 = any
  onlyOpen?: boolean;

  query?: string;

  pageSize?: number;
  pageToken?: string;
};

export type CreateProjectInput = {
  teamId: string;
  name: string;
  description?: string;

  status?: ProjectStatus;
  isOpen?: boolean;

  startedAt?: DateMessage;
  finishedAt?: DateMessage;
};
