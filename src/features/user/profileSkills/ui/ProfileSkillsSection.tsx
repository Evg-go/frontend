import cls from './ProfileSkillsSection.module.css';

import { navigateTo } from '@/shared/lib/navigation/navigation';
import { Button } from '@/shared/ui/Button';

type Skill_item = {
  id: string;
  name: string;
};

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

function normalize_skills(value: unknown): Skill_item[] {
  if (!Array.isArray(value)) return [];

  const result: Skill_item[] = [];
  const used_keys = new Set<string>();

  for (const item of value) {
    if (typeof item === 'string') {
      const name = item.trim();
      if (!name) continue;

      const key = `name:${name.toLowerCase()}`;
      if (used_keys.has(key)) continue;

      used_keys.add(key);
      result.push({
        id: '',
        name,
      });
      continue;
    }

    if (!item || typeof item !== 'object') continue;

    const obj = item as Record<string, unknown>;

    const id = typeof obj.id === 'string' ? obj.id : '';
    const name =
      typeof obj.name === 'string'
        ? obj.name.trim()
        : typeof obj.skill_name === 'string'
          ? obj.skill_name.trim()
          : '';

    if (!name) continue;

    const key = id ? `id:${id}` : `name:${name.toLowerCase()}`;
    if (used_keys.has(key)) continue;

    used_keys.add(key);
    result.push({
      id,
      name,
    });
  }

  return result;
}

function get_skill_key(skill: Skill_item): string {
  return skill.id || `name:${skill.name.toLowerCase()}`;
}