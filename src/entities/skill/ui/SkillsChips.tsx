import cls from './SkillsChips.module.css';

export type skill_chip_item = {
  id: string;
  name: string;
};

type props = {
  title?: string;
  skills: skill_chip_item[];
  empty_text?: string;
  class_name?: string;
};

export function SkillsChips({
  title,
  skills,
  empty_text = 'Скиллы не указаны',
  class_name,
}: props) {
  const root_class_name = [cls.root, class_name].filter(Boolean).join(' ');

  return (
    <div className={root_class_name}>
      {title ? <div className={cls.title}>{title}</div> : null}

      {skills.length > 0 ? (
        <div className={cls.skills_list}>
          {skills.map((skill) => (
            <div key={skill.id} className={cls.skill_chip}>
              <span className={cls.skill_name}>{skill.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={cls.empty}>{empty_text}</div>
      )}
    </div>
  );
}