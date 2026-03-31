import { get_skill_key, normalize_skills } from '@/entities/skill/lib/normalize_skills';
import cls from './ProfileSkillsSection.module.css';

import { navigateTo } from '@/shared/lib/navigation/navigation';
import { Button } from '@/shared/ui/Button';

export function ProfileSkillsSection({ skills }: { skills: unknown }) {
  const normalized_skills = normalize_skills(skills);

  return (
    <div className={cls.card}>
      <div className={cls.card_header}>
        <div>
          <h3 className={cls.title}>Скиллы</h3>
          <div className={cls.muted}></div>
        </div>

        <div className={cls.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigateTo('/profile/skills')}
          >
            Редактировать
          </Button>
        </div>
      </div>

      <div className={cls.row}>
        <div className={cls.label}></div>

        <div className={cls.value}>
          {normalized_skills.length === 0 ? (
            <div className={cls.empty}>Скиллы пока не добавлены</div>
          ) : (
            <div className={cls.skills_list}>
              {normalized_skills.map((skill) => (
                <div key={get_skill_key(skill)} className={cls.skill_chip}>
                  {skill.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
