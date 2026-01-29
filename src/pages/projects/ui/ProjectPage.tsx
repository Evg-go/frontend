import { useParams } from 'react-router-dom';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  return <div>Project page: {projectId}</div>;
}