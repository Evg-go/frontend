import { useState } from 'react';
import { sessionModel } from '@/entities/session/model/session';
import { useMe } from '@/entities/user/model/useMe';
import { Card, CardTitle, Muted } from '@/shared/ui/Card/Card';
import { Button } from '@/shared/ui/Button/Button';
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
  const firstName = u.first_name ?? u.firstName ?? '—';
  const lastName = u.last_name ?? u.lastName ?? '—';
  const phone = u.phone ?? '—';
  const id = u.id ?? u.user_id ?? '—';

  return (
    <div style={{ display: 'grid', gap: 14, maxWidth: 720 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <CardTitle>Profile</CardTitle>
            <Muted>Вся информация берётся из GetMe</Muted>
          </div>

          {!edit ? (
            <Button variant="primary" onClick={() => setEdit(true)}>Edit</Button>
          ) : (
            <Button onClick={() => setEdit(false)}>Close</Button>
          )}
        </div>
      </Card>

      <Card>
        {!edit ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <Row label="ID" value={String(id)} />
            <Row label="Email" value={String(email)} />
            <Row label="First name" value={String(firstName)} />
            <Row label="Last name" value={String(lastName)} />
            <Row label="Phone" value={String(phone)} />
          </div>
        ) : (
          <UpdateProfileForm
            user={meQuery.data}
            onCancel={() => setEdit(false)}
            onSaved={() => setEdit(false)}
          />
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'center' }}>
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}
