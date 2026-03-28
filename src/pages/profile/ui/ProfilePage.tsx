import { useState } from 'react';
import cls from './ProfilePage.module.css';

import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { UpdateProfileForm } from '@/features/user/update-profile/ui/UpdateProfileForm';
import { ProfileSkillsSection } from '@/features/user/profileSkills/ui/ProfileSkillsSection';
import { Button } from '@/shared/ui/Button';

export function ProfilePage() {
  const is_auth = sessionModel.isAuthenticated();
  const me_query = useMe({ enabled: is_auth });
  const [edit, set_edit] = useState(false);

  if (!is_auth) return <div>Unauthorized</div>;
  if (me_query.isLoading) return <div>Loading profile...</div>;
  if (me_query.isError) return <div>Failed to load profile</div>;
  if (!me_query.data) return <div>No profile data</div>;

  const u: any = me_query.data;

  const email = u.email ?? '—';
  const first_name = u.first_name ?? '—';
  const last_name = u.last_name ?? '—';
  const phone = u.phone ?? '—';

  const about = u.about ?? '';
  const is_open = (u.is_user_open_suggestions ?? false) as boolean;
  const is_hidden = (u.is_profile_hidden ?? false) as boolean;

  const competence = u.competence_levels;
  const reviews = u.reviews ?? '';
  const skills = u.skills ?? [];

  return (
    <div className={cls.page}>
      <div className={cls.card}>
        <div className={cls.cardHeader}>
          <div>
            <h3 className={cls.title}>Профиль</h3>
          </div>

          <div className={cls.actions}>
            {!edit ? (
              <Button type="button" variant="secondary" onClick={() => set_edit(true)}>
                Редактировать
              </Button>
            ) : (
              <Button type="button" variant="secondary" onClick={() => set_edit(false)}>
                Закрыть
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={cls.grid}>
        <div className={cls.card}>
          <h3 className={cls.title}>Основное</h3>
          <Row label="Email" value={String(email)} />
        </div>

        <div className={cls.card}>
          <h3 className={cls.title}>Контакты</h3>
          <Row label="Имя" value={String(first_name)} />
          <Row label="Фамилия" value={String(last_name)} />
          <Row label="Телефон" value={String(phone)} />
        </div>
      </div>

      <div className={cls.card}>
        <h3 className={cls.title}>Профиль и настройки</h3>

        {!edit ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <Row label="О себе" value={about ? about : '—'} multiline />
            <Row label="Открыт к предложениям" value={is_open ? 'Да' : 'Нет'} />
            <Row label="Профиль скрыт" value={is_hidden ? 'Да' : 'Нет'} />

            <Row
              label="Компетенции"
              value={format_competence(competence)}
              multiline
            />
            <Row label="Отзывы" value={reviews ? reviews : '—'} multiline />
          </div>
        ) : (
          <UpdateProfileForm
            user={me_query.data}
            onCancel={() => set_edit(false)}
            onSaved={() => set_edit(false)}
          />
        )}
      </div>

      <ProfileSkillsSection skills={skills} />
    </div>
  );
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={cls.row}>
      <div className={cls.label}>{label}</div>
      <div className={multiline ? cls.pre : cls.value}>{value}</div>
    </div>
  );
}

function format_competence(value: unknown): string {
  if (!value) return '—';
  if (typeof value !== 'object') return String(value);

  const obj = value as Record<string, unknown>;
  const entries = Object.entries(obj);

  if (entries.length === 0) return '—';

  return entries.map(([key, item]) => `${key}: ${String(item)}`).join('\n');
}