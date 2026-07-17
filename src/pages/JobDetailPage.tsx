import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJob } from '../hooks/queries/useJobs';
import { getErrorMessage } from '../api/client';
import ManageJobView from '../components/job/ManageJobView';
import FreelancerJobView from '../components/job/FreelancerJobView';

export default function JobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data: job, error, isLoading } = useJob(id);

  if (error) return <p className="text-danger text-sm">{getErrorMessage(error)}</p>;
  if (isLoading || !job) return <p className="text-muted">Loading…</p>;

  const isOwner = Boolean(user && job.owner?.id === user.id);
  return isOwner ? <ManageJobView job={job} /> : <FreelancerJobView job={job} />;
}
