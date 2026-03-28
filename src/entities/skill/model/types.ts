export type Skill = {
  id: string;
  name: string;
};

export type List_skills_params = {
  query?: string;
  page_size?: number;
  page_token?: string;
};

export type List_skills_response = {
  skills: Skill[];
  next_page_token: string;
};