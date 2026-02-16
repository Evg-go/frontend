import type { api_date} from '@/entities/project/model/types';

export type create_project_payload = {
  name: string;
  description: string;
  status: number;
  is_open: boolean;

  started_at?: api_date;
  finished_at?: api_date;

  team_name: string;
};

export type update_project_payload = {
  project_id: string;
  name?: string;
  description?: string;
  status?: number;
  is_open?: boolean;
  started_at?: api_date;
  finished_at?: api_date;
};