import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThumbsDown, Heart, BadgeCheck, Star, MapPin } from 'lucide-react';
import { timeAgo, proposalRange, money, experienceLabel } from '../../utils/format';
import Pill from '../ui/Pill';
import type { Job, JobOwner } from '../../types';

const MAX_SKILLS = 4;

interface JobFeedCardProps {
  job: Job;
  onDismiss?: (id: string) => void;
}

export default function JobFeedCard({ job, onDismiss }: JobFeedCardProps) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const owner: Partial<JobOwner> = job.owner ?? {};
  const type = job.jobType === 'HOURLY' ? 'Hourly' : 'Fixed price';
  const skills = job.skills ?? [];
  const shownSkills = skills.slice(0, MAX_SKILLS);
  const extraSkills = skills.length - shownSkills.length;

  function stop(event: MouseEvent, action: () => void) {
    event.stopPropagation();
    action();
  }

  return (
    <article
      className="cursor-pointer border-b border-hair px-1.5 py-5 transition-colors hover:bg-soft"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-muted">
          Posted {timeAgo(job.createdAt)} &nbsp;•&nbsp; Proposals: {proposalRange(job.bidCount)}
        </span>
        <div className="flex shrink-0 gap-1.5">
          <button
            className="grid h-8.5 w-8.5 cursor-pointer place-items-center rounded-full border border-line bg-white p-0 text-muted hover:border-ink hover:text-ink"
            title="Not interested"
            onClick={(e) => stop(e, () => onDismiss?.(job.id))}
          >
            <ThumbsDown size={16} />
          </button>
          <button
            className="grid h-8.5 w-8.5 cursor-pointer place-items-center rounded-full border border-line bg-white p-0 text-muted hover:border-ink hover:text-ink"
            title="Save job"
            onClick={(e) => stop(e, () => setSaved((s) => !s))}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <h3 className="my-1.5 text-xl">
        <Link to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>
          {job.title}
        </Link>
      </h3>

      <p className="mb-2.5 text-[13px] text-muted">
        {type} - {experienceLabel(job.experienceLevel)}
        {job.durationLabel ? ` - Est. Time: ${job.durationLabel}` : ''}
      </p>

      <p className={`mb-1 ${expanded ? '' : 'line-clamp-2'}`}>{job.description}</p>
      {job.description.length > 140 && (
        <button
          className="mb-3 cursor-pointer font-medium text-brand hover:underline"
          onClick={(e) => stop(e, () => setExpanded((v) => !v))}
        >
          {expanded ? 'less' : 'more'}
        </button>
      )}

      {skills.length > 0 && (
        <div className="mb-3.5 flex flex-wrap gap-2">
          {shownSkills.map((skill) => (
            <Pill key={skill}>{skill}</Pill>
          ))}
          {extraSkills > 0 && <Pill>+{extraSkills}</Pill>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4.5 text-[13px] text-muted">
        {owner.paymentVerified && (
          <span className="inline-flex items-center gap-1.25">
            <BadgeCheck size={16} className="text-verified" /> Payment verified
          </span>
        )}
        {owner.rating != null && (
          <span className="inline-flex items-center gap-1.25">
            <Star size={15} className="text-star" fill="currentColor" /> {owner.rating.toFixed(1)}
          </span>
        )}
        {(owner.totalSpent ?? 0) > 0 && (
          <span className="inline-flex items-center gap-1.25">{money(owner.totalSpent)} spent</span>
        )}
        {owner.country && (
          <span className="inline-flex items-center gap-1.25">
            <MapPin size={15} /> {owner.country}
          </span>
        )}
      </div>
    </article>
  );
}
