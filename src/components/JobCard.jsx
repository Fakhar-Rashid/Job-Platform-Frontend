import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="card">
      <div className="row between">
        <h3><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
        <span className={`badge ${job.status.toLowerCase()}`}>{job.status}</span>
      </div>
      <p className="muted">{job.description}</p>
      <div className="row between">
        <span>Budget: ${job.budget}</span>
        <span className="muted">
          {job.bidCount ?? 0} bids · by {job.owner?.name ?? 'Unknown'}
        </span>
      </div>
    </div>
  );
}
