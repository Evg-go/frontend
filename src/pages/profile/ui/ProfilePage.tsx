import { useState } from 'react';
import cls from './ProfilePage.module.css';

import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { UpdateProfileForm } from '@/features/user/update-profile/ui/UpdateProfileForm';

export function ProfilePage() {
  const isAuth = sessionModel.isAuthenticated();
  const meQuery = useMe({ enabled: isAuth });
  const [edit, setEdit] = useState(false);

  if (!isAuth) return <div>Unauthorized</div>;
  if (meQuery.isLoading) return <div>Loading profile...</div>;
  if (meQuery.isError) return <div>Failed to load profile</div>;
  if (!meQuery.data) return <div>No profile data</div>;

  const u: any = meQuery.data;

  const email = u.email ?? '—';
  const firstName = u.first_name ?? '—';
  const lastName = u.last_name ?? '—';
  const phone = u.phone ?? '—';

  const about = u.about ?? '';
  const isOpen = (u.is_user_open_suggestions ??  true) as boolean;
  const isHidden = (u.is_profile_hidden ?? false) as boolean;

  const competence = u.competence_levels;
  const reviews = u.reviews ?? '';

  return (
    <div className={cls.page}>
      {/* Верхняя карточка: заголовок + кнопка редактирования */}
      <div className={cls.card}>
        <div className={cls.cardHeader}>
          <div>
            <h3 className={cls.title}>Профиль</h3>
          </div>

          <div className={cls.actions}>
            {!edit ? (
              <button onClick={() => setEdit(true)}>Редактировать</button>
            ) : (
              <button onClick={() => setEdit(false)}>Закрыть</button>
            )}
          </div>
        </div>
      </div>

      {/* Две колонки */}
      <div className={cls.grid}>
        <div className={cls.card}>
          <h3 className={cls.title}>Основное</h3>
          <Row label="Email" value={String(email)} />
        </div>

        <div className={cls.card}>
          <h3 className={cls.title}>Контакты</h3>
          <Row label="Имя" value={String(firstName)} />
          <Row label="Фамилия" value={String(lastName)} />
          <Row label="Телефон" value={String(phone)} />
        </div>
      </div>

      {/* Широкий модуль на всю ширину */}
      <div className={cls.card}>
        <h3 className={cls.title}>Профиль и настройки</h3>

        {!edit ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <Row label="О себе" value={about ? about : '—'} multiline />
            <Row label="Открыт к предложениям" value={isOpen ? 'Да' : 'Нет'} />
            <Row label="Профиль скрыт" value={isHidden ? 'Да' : 'Нет'} />

            <Row label="Компетенции" value={formatCompetence(competence)} multiline />
            <Row label="Отзывы" value={reviews ? reviews : '—'} multiline />
          </div>
        ) : (
          <UpdateProfileForm
            user={meQuery.data}
            onCancel={() => setEdit(false)}
            onSaved={() => setEdit(false)}
          />
        )}
      </div>
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

function formatCompetence(v: unknown): string {
  if (!v) return '—';
  if (typeof v !== 'object') return String(v);

  const obj = v as Record<string, unknown>;
  const entries = Object.entries(obj);
  if (entries.length === 0) return '—';

  return entries.map(([k, val]) => `${k}: ${String(val)}`).join('\n');
}
