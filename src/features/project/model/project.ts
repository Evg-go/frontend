import type { api_date } from "@/entities/project/model/types";

export interface Project {
  id: string;
  name: string;
  status: string;
  description?: string;
  started_at: string;
  created_at: string;
}

export interface UpdateProjectData {
  project_id: string;
  name: string;
  description: string;
  is_open: boolean;
  status: number;
  started_at: api_date | undefined;  
  finished_at: api_date | undefined; 
}