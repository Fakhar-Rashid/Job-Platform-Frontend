import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Pill from '../components/ui/Pill';
import BoostSection from '../components/job/BoostSection';
import { useAuth } from '../hooks/useAuth';
import { useJob } from '../hooks/queries/useJobs';
import { useMyBids, usePlaceBid } from '../hooks/queries/useBids';
import { getErrorMessage } from '../api/client';
import { DURATION_LABEL, experienceLabel, jobRateLabel, serviceFee, timeAgo } from '../utils/format';
import type { CurrentUser, JobDetail } from '../types';

interface ProposalFormProps {
  job: JobDetail;
  user: CurrentUser;
}

function ProposalForm({ job, user }: ProposalFormProps) {
  const navigate = useNavigate();
  const placeBid = usePlaceBid(job.id);
  const hourly = job.jobType === 'HOURLY';

  const [amount, setAmount] = useState(hourly && user.hourlyRate ? String(user.hourlyRate) : '');
  const [coverLetter, setCoverLetter] = useState('');
  const [boost, setBoost] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');

  const baseCost = job.connectsRequired;
  const totalCost = baseCost + boost;
  const remaining = (user.connectBalance ?? 0) - totalCost;
  const { fee, receives } = serviceFee(Number(amount) || 0);
  const valid = Number(amount) > 0 && coverLetter.trim().length >= 10 && remaining >= 0;

  async function submit() {
    setError('');
    try {
      await placeBid.mutateAsync({ amount: Number(amount), coverLetter, boostConnects: boost });
      navigate('/my-bids');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h1>Submit a proposal</h1>

      <Card>
        <h3 className="mb-2">Proposal settings</h3>
        <p className="text-sm">
          This proposal requires <b>{baseCost} Connects</b>
        </p>
        <p className="text-sm text-muted">
          When you submit this proposal, you'll have {Math.max(remaining, 0)} Connects remaining.
        </p>
        {remaining < 0 && (
          <p className="mt-1 text-sm text-danger">
            You don't have enough Connects.{' '}
            <Link to="/settings" className="font-semibold text-brand">
              Buy Connects
            </Link>
          </p>
        )}
      </Card>

      <Card>
        <h3 className="mb-3">Job details</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{job.title}</div>
            <div className="mt-1.5 flex items-center gap-2.5">
              {job.category && <Pill>{job.category}</Pill>}
              <span className="text-[13px] text-muted">Posted {timeAgo(job.createdAt)}</span>
            </div>
            <p className={`mt-2.5 ${expanded ? '' : 'line-clamp-3'}`}>{job.description}</p>
            {job.description.length > 140 && (
              <button
                type="button"
                className="cursor-pointer font-medium text-brand hover:underline"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? 'less' : 'more'}
              </button>
            )}
            <div className="mt-3">
              <Link to={`/jobs/${job.id}`} className="font-semibold text-brand">
                View job posting
              </Link>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 text-sm md:w-52">
            <div>
              <div className="font-semibold">{experienceLabel(job.experienceLevel)}</div>
              <div className="text-muted">Experience level</div>
            </div>
            <div>
              <div className="font-semibold">{jobRateLabel(job)}</div>
              <div className="text-muted">{hourly ? 'Hourly' : 'Fixed'}</div>
            </div>
            {job.duration && (
              <div>
                <div className="font-semibold">{DURATION_LABEL[job.duration]}</div>
                <div className="text-muted">Duration</div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-1.5">Terms</h3>
        <p className="font-medium">
          {hourly ? "What is the rate you'd like to bid for this job?" : "What is the amount you'd like to bid?"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hourly && <>Your profile rate: ${user.hourlyRate ?? '—'}/hr &nbsp;·&nbsp; </>}
          Client's budget: {jobRateLabel(job)}
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">{hourly ? 'Hourly rate' : 'Total amount'}</div>
              <div className="text-[13px] text-muted">Total amount the client will see on your proposal</div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span>$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                className="w-32"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {hourly && <span className="text-muted">/hr</span>}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="font-medium">Freelancer Service Fee: 10%</div>
            <div className="text-muted">-${fee}</div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">You'll receive</div>
              <div className="text-[13px] text-muted">
                The estimated amount you'll receive after service fees
              </div>
            </div>
            <div className="font-semibold">
              ${receives}
              {hourly ? '/hr' : ''}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3">Additional details</h3>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Cover Letter
          <textarea rows={8} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required />
        </label>
      </Card>

      <BoostSection jobId={job.id} baseCost={baseCost} boost={boost} onChange={setBoost} />

      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex items-center gap-3">
        <Button disabled={!valid || placeBid.isPending} onClick={submit}>
          Send for {totalCost} Connects
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data: job, error, isLoading } = useJob(id);
  const { data: myBids = [] } = useMyBids();

  if (error) return <p className="text-danger text-sm">{getErrorMessage(error)}</p>;
  if (isLoading || !job || !user) return <p className="text-muted">Loading…</p>;
  if (job.ownerId === user.id) return <Navigate to={`/jobs/${id}`} replace />;

  if (myBids.some((bid) => bid.jobId === job.id)) {
    return (
      <Card className="mx-auto max-w-3xl">
        <p>You already submitted a proposal for this job.</p>
        <Link to="/my-bids" className="mt-2 inline-block font-semibold text-brand">
          View my proposals
        </Link>
      </Card>
    );
  }

  if (job.status === 'CLOSED') {
    return (
      <Card className="mx-auto max-w-3xl">
        <p className="text-muted">This job is no longer accepting proposals.</p>
      </Card>
    );
  }

  return <ProposalForm job={job} user={user} />;
}
