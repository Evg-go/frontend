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
    list: '/projects',
    create: '/projects',
    byId: (projectId: string) => `/projects/${projectId}`,
    update: (projectId: string) => `/projects/${projectId}`,
    delete: (projectId: string) => `/projects/${projectId}`,
  },
};