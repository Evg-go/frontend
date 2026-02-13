import { Link, useNavigate } from 'react-router-dom';
import cls from './CreateProjectPage.module.css';

import { CreateProjectForm } from '@/features/project/create/ui/CreateProjectForm';

export function CreateProjectPage() {
  const navigate = useNavigate();

  return (
    <div className={cls.wrap}>
      <div className={cls.card}>
        <div className={cls.header}>
          <h3 className={cls.title}>Создать проект</h3>
          <Link to="/projects">← Назад</Link>
        </div>

        <CreateProjectForm
          on_created={() => {
            navigate('/projects', { replace: true });
          }}
        />
      </div>
    </div>
  );
}
