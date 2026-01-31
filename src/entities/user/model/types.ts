export type User = {
  id?: string;
  email?: string;
  username?: string;

  first_name?: string;
  last_name?: string;

  phone?: string;

  about?: string;
  reviews?: string;

  competence_levels?: Record<string, string> | unknown;

  is_user_open_suggestions?: boolean;
  is_profile_hidden?: boolean;

  [key: string]: unknown;
};