import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import Button from '../components/ui/Button.jsx';
import { useMyJobs } from '../hooks/queries/useJobs.js';
import { getErrorMessage } from '../api/client.js';

export default function MyJobsPage() {
  const { data: jobs = [], error, isLoading } = useMyJobs();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>My jobs</h2>
        <Link to="/post-job"><Button>Post a job</Button></Link>
      </div>
      {error && <p className="text-sm text-danger">{getErrorMessage(error)}</p>}
      {isLoading ? (
        <p className="text-muted">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-muted">You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </>
  );
}
