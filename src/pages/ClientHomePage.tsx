import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutGrid, List, Plus, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useMyJobs } from '../hooks/queries/useJobs';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import { jobRateLabel, timeAgo } from '../utils/format';
import type { Job } from '../types';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export default function ClientHomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: jobs = [], error, isLoading } = useMyJobs();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const firstName = user?.name.split(' ')[0] ?? '';

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1>
          Good {greeting()}, {firstName}
        </h1>
        <Button onClick={() => navigate('/post-job')}>
          <Plus size={16} /> Post a job
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <h2>Overview</h2>
        <div className="flex items-center rounded-full bg-chip p-1">
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setView('grid')}
            className={`rounded-full p-1.5 ${view === 'grid' ? 'bg-white shadow-sm text-ink' : 'text-muted'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setView('list')}
            className={`rounded-full p-1.5 ${view === 'list' ? 'bg-white shadow-sm text-ink' : 'text-muted'}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
      {isLoading ? (
        <p className="text-muted">Loading…</p>
      ) : error ? (
        <p className="text-sm text-danger">{getErrorMessage(error)}</p>
      ) : jobs.length === 0 ? (
        <Card className="rounded-2xl py-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-soft">
              <Briefcase size={40} className="text-muted" />
            </span>
            <p className="text-muted">No job posts or contracts in progress right now</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/talent')}>
                <Search size={16} /> Find a talent
              </Button>
              <Button onClick={() => navigate('/post-job')}>
                <Plus size={16} /> Post a job
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'flex flex-col gap-4'}>
          {jobs.map((job: Job) => (
            <Card key={job.id}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <Badge variant={job.status.toLowerCase() as 'open' | 'closed'}>{job.status}</Badge>
              </div>
              <p className="text-sm text-muted">
                {job.bidCount ?? 0} proposals · Posted {timeAgo(job.createdAt)}
              </p>
              <p className="text-sm">{jobRateLabel(job)}</p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
