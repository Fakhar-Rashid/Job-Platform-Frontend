import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Calendar, Check, Clock, Heart, MapPin, Repeat, Settings2, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import { useAuth } from '../../hooks/useAuth';
import { useSavedJobs, useToggleSaveJob } from '../../hooks/queries/useJobs';
import { useMyBids } from '../../hooks/queries/useBids';
import {
  DURATION_LABEL,
  TERM_LABEL,
  experienceLabel,
  jobRateLabel,
  proposalRange,
  timeAgo,
} from '../../utils/format';
import type { JobDetail } from '../../types';

interface MetaCellProps {
  icon: LucideIcon;
  value: string;
  sub: string;
}

function MetaCell({ icon: Icon, value, sub }: MetaCellProps) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={18} className="mt-0.5 shrink-0 text-muted" />
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-[13px] text-muted">{sub}</div>
      </div>
    </div>
  );
}

function ApplyButton({ jobId }: { jobId: string }) {
  const navigate = useNavigate();
  const { data: myBids = [] } = useMyBids();
  const applied = myBids.some((bid) => bid.jobId === jobId);

  if (applied) {
    return (
      <Button className="w-full" disabled>
        Proposal submitted
      </Button>
    );
  }
  return (
    <Button className="w-full" onClick={() => navigate(`/jobs/${jobId}/apply`)}>
      Apply now
    </Button>
  );
}

interface FreelancerJobViewProps {
  job: JobDetail;
}

export default function FreelancerJobView({ job }: FreelancerJobViewProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: savedJobs = [] } = useSavedJobs(Boolean(user));
  const toggleSave = useToggleSaveJob();
  const saved = savedJobs.some((entry) => entry.id === job.id);

  const hourly = job.jobType === 'HOURLY';
  const { activity, client } = job;
  const jobLink = `${window.location.origin}/jobs/${job.id}`;
  const memberSince = new Date(client.memberSince).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  function handleSave() {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleSave.mutate({ jobId: job.id, saved });
  }

  function copyLink() {
    void navigator.clipboard.writeText(jobLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <section className="border-b border-hair pb-6">
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted">
            <span>Posted {timeAgo(job.createdAt)}</span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} /> Worldwide
            </span>
          </div>
        </section>

        <section className="border-b border-hair pb-6 pt-6">
          <div className="text-sm text-muted">Summary</div>
          <p className="mt-2 whitespace-pre-wrap">{job.description}</p>
        </section>

        <section className="grid grid-cols-2 gap-6 border-b border-hair pb-6 pt-6 md:grid-cols-3">
          {job.projectTerm && (
            <MetaCell icon={Clock} value={TERM_LABEL[job.projectTerm]} sub={hourly ? 'Hourly' : 'Fixed price'} />
          )}
          {job.duration && <MetaCell icon={Calendar} value={DURATION_LABEL[job.duration]} sub="Duration" />}
          <MetaCell
            icon={Settings2}
            value={experienceLabel(job.experienceLevel)}
            sub="I am looking for a mix of experience and value"
          />
          <MetaCell icon={Timer} value={jobRateLabel(job)} sub={hourly ? 'Hourly' : 'Fixed'} />
          {job.contractToHire && (
            <MetaCell
              icon={Repeat}
              value="Contract-to-hire"
              sub="This job has the potential to turn into a full time role"
            />
          )}
        </section>

        <section className="border-b border-hair pb-6 pt-6 text-sm">
          <span className="font-semibold">Project Type:</span> Ongoing project
        </section>

        <section className="border-b border-hair pb-6 pt-6">
          <h3 className="mb-3">Skills and Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Pill key={skill}>{skill}</Pill>
            ))}
          </div>
        </section>

        <section className="pt-6">
          <h3 className="mb-3">Activity on this job</h3>
          <div className="flex flex-col gap-1.5 text-sm">
            <div>
              <span className="font-medium">Proposals:</span> {proposalRange(activity.proposalCount)}
            </div>
            {activity.lastViewedAt && (
              <div>
                <span className="font-medium">Last viewed by client:</span> {timeAgo(activity.lastViewedAt)}
              </div>
            )}
            {activity.bidRange && (
              <div className="font-semibold">
                Bid range - High ${activity.bidRange.high} | Avg ${activity.bidRange.avg} | Low $
                {activity.bidRange.low}
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-4 lg:border-l lg:border-hair lg:pl-7">
        {job.status === 'CLOSED' ? (
          <p className="text-sm text-muted">This job is no longer accepting proposals</p>
        ) : user ? (
          <ApplyButton jobId={job.id} />
        ) : (
          <Button className="w-full" onClick={() => navigate('/login')}>
            Apply now
          </Button>
        )}

        <Button variant="outline" className="w-full" onClick={handleSave}>
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save job'}
        </Button>

        <div className="text-sm">
          <div>
            Send a proposal for: <b>{job.connectsRequired} Connects</b>
          </div>
          {user && <div className="text-muted">Available Connects: {user.connectBalance}</div>}
        </div>

        <div>
          <h3 className="mb-3">About the client</h3>
          <div className="flex flex-col gap-2 text-sm">
            {client.paymentVerified ? (
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-verified" /> Payment method verified
              </span>
            ) : (
              <span className="text-muted">Payment method not verified</span>
            )}
            {client.phoneVerified && (
              <span className="inline-flex items-center gap-1.5">
                <Check size={16} className="text-brand" /> Phone number verified
              </span>
            )}
            {client.country && <div className="font-semibold">{client.country}</div>}
            <div>
              {client.hireRate}% hire rate, {client.openJobs} open job{client.openJobs === 1 ? '' : 's'}
            </div>
            <div>Member since {memberSince}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-muted">Job link</div>
          <input readOnly value={jobLink} className="mt-1.5 w-full bg-chip text-sm" />
          <button
            type="button"
            className="mt-1.5 cursor-pointer text-sm font-semibold text-brand hover:underline"
            onClick={copyLink}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </aside>
    </div>
  );
}
