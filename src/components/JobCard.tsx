import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { jobRateLabel } from '../utils/format';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg">
          <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        </h3>
        <Badge variant={job.status.toLowerCase() as 'open' | 'closed'}>{job.status}</Badge>
      </div>
      <p className="text-muted">{job.description}</p>
      <div className="flex items-center justify-between gap-3">
        <span>{jobRateLabel(job)}</span>
        <span className="text-muted">
          {job.bidCount ?? 0} bids · by {job.owner?.name ?? 'Unknown'}
        </span>
      </div>
    </Card>
  );
}
