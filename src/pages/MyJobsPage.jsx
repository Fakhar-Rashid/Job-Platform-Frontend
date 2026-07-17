import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import * as jobsApi from '../api/jobs.js';
import { getErrorMessage } from '../api/client.js';
import Button from '../components/ui/Button.jsx';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsApi.myJobs().then(setJobs).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>My jobs</h2>
        <Link to="/post-job"><Button>Post a job</Button></Link>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {jobs.length === 0 ? (
        <p className="text-muted">You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </>
  );
}
