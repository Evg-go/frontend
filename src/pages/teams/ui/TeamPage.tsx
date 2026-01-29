import { useParams } from 'react-router-dom';

export function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();

  return <div>Team page: {teamId}</div>;
}
