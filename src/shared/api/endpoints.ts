export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  userProfile: {
    me: '/users/me',       
    updateMe: '/users/me', 
  },
  projects: {
    projects: '/projects',
    projects_public: '/projects/public',
    project_by_id: (project_id: string) => `/projects/${project_id}`,
  },
};