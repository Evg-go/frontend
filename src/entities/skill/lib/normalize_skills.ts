import type { Skill } from '../model/types';

export function normalize_skills(value: unknown): Skill[] {
  if (!Array.isArray(value)) return [];

  const result: Skill[] = [];
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

    const id =
      typeof obj.id === 'string'
        ? obj.id
        : typeof obj.skill_id === 'string'
          ? obj.skill_id
          : '';

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

export function get_skill_key(skill: Skill): string {
  return skill.id || `name:${skill.name.toLowerCase()}`;
}

export function are_skill_lists_equal(left: Skill[], right: Skill[]): boolean {
  if (left.length !== right.length) return false;

  const left_keys = left.map(get_skill_identity).sort();
  const right_keys = right.map(get_skill_identity).sort();

  for (let index = 0; index < left_keys.length; index += 1) {
    if (left_keys[index] !== right_keys[index]) {
      return false;
    }
  }

  return true;
}

function get_skill_identity(skill: Skill): string {
  return skill.id || `name:${skill.name.toLowerCase()}`;
}