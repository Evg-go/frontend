import cls from './EditProfileSkillsPage.module.css';

import { normalize_skills } from '@/entities/skill/lib/normalize_skills';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { EditProfileSkillsForm } from '@/features/user/editProfileSkills/ui/EditProfileSkillsForm';
import { navigateTo } from '@/shared/lib/navigation/navigation';

export function EditProfileSkillsPage() {
  const is_auth = sessionModel.isAuthenticated();
  const me_query = useMe({ enabled: is_auth });

  if (!is_auth) return <div>Unauthorized</div>;
  if (me_query.isLoading) return <div>Loading skills...</div>;
  if (me_query.isError) return <div>Failed to load skills</div>;
  if (!me_query.data) return <div>No profile data</div>;

  const u: any = me_query.data;
  const initial_skills = normalize_skills(u.skills);

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <div className={cls.card_header}>
          <div>
            <h1 className={cls.title}>Редактирование скиллов</h1>
            <div className={cls.muted}>
              Здесь можно удалить текущие скиллы и добавить новые. Сохранение идёт одним запросом.
            </div>
          </div>

          <div className={cls.actions}>
            <button
              type="button"
              className={cls.secondary_button}
              onClick={() => navigateTo('/profile')}
            >
              Назад в профиль
            </button>
          </div>
        </div>
      </div>

      <div className={cls.card}>
        <EditProfileSkillsForm
          initial_skills={initial_skills}
          on_saved={() => navigateTo('/profile')}
        />
      </div>
    </div>
  );
}