import { Link } from 'react-router-dom';
import Card from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';

export default function JobCard({ job }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg"><Link to={`/jobs/${job.id}`}>{job.title}</Link></h3>
        <Badge variant={job.status.toLowerCase()}>{job.status}</Badge>
      </div>
      <p className="text-muted">{job.description}</p>
      <div className="flex items-center justify-between gap-3">
        <span>Budget: ${job.budget}</span>
        <span className="text-muted">
          {job.bidCount ?? 0} bids · by {job.owner?.name ?? 'Unknown'}
        </span>
      </div>
    </Card>
  );
}
