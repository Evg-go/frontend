import { useParams } from 'react-router-dom';

import cls from './EditProjectSkillsPage.module.css';

import { normalize_skills } from '@/entities/skill/lib/normalize_skills';
import { use_project } from '@/entities/project/model/hooks';
import { EditProjectSkillsForm } from '@/features/project/editProjectSkills/ui/editProjectSkillsForm';
import { navigateTo } from '@/shared/lib/navigation/navigation';
import { Button } from '@/shared/ui/Button';

export function EditProjectSkillsPage() {
  const { projectId: project_id } = useParams();

  const project_query = use_project(project_id || '');

  if (!project_id) {
    return <div>Project id is required</div>;
  }

  if (project_query.isLoading) {
    return <div>Loading skills...</div>;
  }

  if (project_query.isError) {
    return <div>Failed to load project skills</div>;
  }

  if (!project_query.data) {
    return <div>No project data</div>;
  }

  const project_data = project_query.data as Record<string, unknown>;
  const project_name = String(project_data.name ?? '');
  const initial_skills = normalize_skills(project_data.skills);

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <div className={cls.card_header}>
          <div>
            <h1 className={cls.title}>Редактирование скиллов проекта</h1>
            <div className={cls.muted}>
              {project_name ? `Проект: ${project_name}. ` : ''}
            </div>
          </div>

          <div className={cls.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigateTo(`/projects/${project_id}/edit`)}
            >
              Назад к редактированию
            </Button>
          </div>
        </div>
      </div>

      <div className={cls.card}>
        <EditProjectSkillsForm
          project_id={project_id}
          initial_skills={initial_skills}
          on_saved={() => navigateTo(`/projects/${project_id}`)}
        />
      </div>
    </div>
  );
}