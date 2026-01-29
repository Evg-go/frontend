export type User = {
  id?: string;
  email?: string;
  user_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  // в proto больше полей — добавим чуть позже 
  [key: string]: unknown;
};