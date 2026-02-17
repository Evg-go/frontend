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
    update: (project_id: string) => `/projects/${project_id}`,
    project_members: (project_id: string) => `/projects/${project_id}/members`,
    project_member_by_id: (project_id: string, user_id: string) =>
      `/projects/${project_id}/members/${user_id}`,
    project_member_rights: (project_id: string, user_id: string) =>
      `/projects/${project_id}/members/${user_id}/rights`,
    project_join_requests: (project_id: string) => `/projects/${project_id}/join-requests`,
  },
};