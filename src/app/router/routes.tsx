import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('@/pages/home/ui/HomePage').then((m) => ({ default: m.HomePage })),
);

export const LoginPage = lazy(() =>
  import('@/pages/auth/ui/LoginPage').then((m) => ({ default: m.LoginPage })),
);

export const ProjectsPage = lazy(() =>
  import('@/pages/projects/ui/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);

export const ProjectPage = lazy(() =>
  import('@/pages/projects/ui/ProjectDetailsPage').then((m) => ({ default: m.ProjectDetailsPage })),
);

export const TeamsPage = lazy(() =>
  import('@/pages/teams/ui/TeamsPage').then((m) => ({ default: m.TeamsPage })),
);

export const TeamPage = lazy(() =>
  import('@/pages/teams/ui/TeamPage').then((m) => ({ default: m.TeamPage })),
);

export const NotFoundPage = lazy(() =>
  import('@/pages/not-found/ui/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export const RegisterPage = lazy(() =>
  import('@/pages/auth/ui/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);

export const ProfilePage = lazy(() =>
  import('@/pages/profile/ui/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

export const CreateProjectPage = lazy(() =>
  import('@/pages/projects/ui/CreateProjectPage').then((m) => ({ default: m.CreateProjectPage })),
);

export const ProjectDetailsPage = lazy(() =>
  import('@/pages/projects/ui/ProjectDetailsPage').then((m) => ({ default: m.ProjectDetailsPage })),
);

export const MyProjectsPage = lazy(() =>
  import('@/pages/projects/ui/MyProjectsPage').then((m) => ({ default: m.MyProjectsPage })),
);