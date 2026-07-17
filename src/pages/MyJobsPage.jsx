import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import * as jobsApi from '../api/jobs.js';
import { getErrorMessage } from '../api/client.js';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    jobsApi.myJobs().then(setJobs).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <>
      <div className="row between">
        <h2>My jobs</h2>
        <Link to="/post-job"><button>Post a job</button></Link>
      </div>
      {error && <p className="error">{error}</p>}
      {jobs.length === 0 ? (
        <p className="muted">You haven't posted any jobs yet.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </>
  );
}
