import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThumbsDown, Heart, BadgeCheck, Star, MapPin } from 'lucide-react';
import { timeAgo, proposalRange, money, experienceLabel } from '../../utils/format.js';

const MAX_SKILLS = 4;

export default function JobFeedCard({ job, onDismiss }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const owner = job.owner ?? {};
  const type = job.jobType === 'HOURLY' ? 'Hourly' : 'Fixed price';
  const skills = job.skills ?? [];
  const shownSkills = skills.slice(0, MAX_SKILLS);
  const extraSkills = skills.length - shownSkills.length;

  function stop(event, action) {
    event.stopPropagation();
    action();
  }

  return (
    <article className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <div className="top">
        <span className="stamp">
          Posted {timeAgo(job.createdAt)} &nbsp;•&nbsp; Proposals: {proposalRange(job.bidCount)}
        </span>
        <div className="actions">
          <button className="icon-btn" title="Not interested"
            onClick={(e) => stop(e, () => onDismiss?.(job.id))}>
            <ThumbsDown size={16} />
          </button>
          <button className="icon-btn" title="Save job"
            onClick={(e) => stop(e, () => setSaved((s) => !s))}>
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <h3><Link to={`/jobs/${job.id}`} onClick={(e) => e.stopPropagation()}>{job.title}</Link></h3>

      <p className="meta">
        {type} - {experienceLabel(job.experienceLevel)}
        {job.durationLabel ? ` - Est. Time: ${job.durationLabel}` : ''}
      </p>

      <p className={`desc ${expanded ? '' : 'clamp'}`}>{job.description}</p>
      {job.description.length > 140 && (
        <button className="more-link" onClick={(e) => stop(e, () => setExpanded((v) => !v))}>
          {expanded ? 'less' : 'more'}
        </button>
      )}

      {skills.length > 0 && (
        <div className="pills">
          {shownSkills.map((skill) => <span className="pill" key={skill}>{skill}</span>)}
          {extraSkills > 0 && <span className="pill">+{extraSkills}</span>}
        </div>
      )}

      <div className="trust">
        {owner.paymentVerified && (
          <span className="item"><BadgeCheck size={16} className="verified" /> Payment verified</span>
        )}
        {owner.rating != null && (
          <span className="item"><Star size={15} className="star" fill="currentColor" /> {owner.rating.toFixed(1)}</span>
        )}
        {owner.totalSpent > 0 && <span className="item">{money(owner.totalSpent)} spent</span>}
        {owner.country && <span className="item"><MapPin size={15} /> {owner.country}</span>}
      </div>
    </article>
  );
}
