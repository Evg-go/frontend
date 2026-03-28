import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppShell } from '@/widgets/app-shell/ui/AppShell';
import { RequireAuth } from '@/features/auth/require-auth/ui/RequireAuth';

import {
  HomePage,
  LoginPage,
  ProjectsPage,
  ProjectPage,
  TeamsPage,
  TeamPage,
  RegisterPage,
  NotFoundPage,
  ProfilePage,
  CreateProjectPage,
  ProjectDetailsPage,
  MyProjectsPage,
  EditProjectPage,
} from './routes';
import { EditProfileSkillsPage } from '@/pages/profileSkills/ui/EditProfileSkillsPage';

function PageFallback() {
  return <div>Loading...</div>;
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          {/* public */}
          <Route path="/login" element={<LoginPage />} />

          {/* protected */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <ProjectsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <RequireAuth>
                <ProjectPage />
              </RequireAuth>
            }
          />
          <Route
            path="/teams"
            element={
              <RequireAuth>
                <TeamsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/teams/:teamId"
            element={
              <RequireAuth>
                <TeamPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          <Route
            path="/projects/new"
            element={
              <RequireAuth>
                <CreateProjectPage />
              </RequireAuth>
            }
          />

          <Route
            path="/projects/:projectId"
            element={
              <RequireAuth>
                <ProjectDetailsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/projects/my"
            element={
              <RequireAuth>
                <MyProjectsPage />
              </RequireAuth>
            }
          />

          <Route
            path="/projects/edit/:projectId"
            element={
              <RequireAuth>
                <EditProjectPage />
              </RequireAuth>
            }
          />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

          <Route path="/profile/skills" element={<EditProfileSkillsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
