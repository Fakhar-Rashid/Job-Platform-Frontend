import SectionCard from './SectionCard';
import Stars from './Stars';
import Pill from '../ui/Pill';
import { useUpdateCore } from '../../hooks/queries/useProfile';
import type { Profile, JobType } from '../../types';

interface WorkHistorySectionProps {
  profile: Profile;
  editable: boolean;
}

function priceLabel(type: JobType) {
  return type === 'HOURLY' ? 'Hourly' : 'Fixed price';
}

export default function WorkHistorySection({ profile, editable }: WorkHistorySectionProps) {
  const { completedJobs, insights, showWorkHistory } = profile;
  const updateCore = useUpdateCore();

  if (!editable && !showWorkHistory) return null;

  function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    updateCore.mutate({ showWorkHistory: event.target.checked });
  }

  return (
    <SectionCard title="Work history">
      {editable && (
        <label className="flex items-center justify-between gap-3 border-t border-hair py-2.25 text-sm font-medium">
          <span>Show work history on public profile</span>
          <input type="checkbox" checked={showWorkHistory} onChange={toggle} />
        </label>
      )}

      {insights.length > 0 && (
        <>
          <h4 className="mt-4.5 mb-2 border-b border-hair pb-1.5 text-[15px]">
            Insights from completed jobs
          </h4>
          <div className="flex flex-wrap gap-2">
            {insights.map((i) => (
              <Pill key={i.label}>
                {i.label} {i.count}
              </Pill>
            ))}
          </div>
        </>
      )}

      <h4 className="mt-4.5 mb-2 border-b border-hair pb-1.5 text-[15px]">
        Completed jobs ({completedJobs.length})
      </h4>
      {completedJobs.length === 0 && <p className="text-muted">No completed jobs yet.</p>}
      {completedJobs.map((job) => (
        <div className="border-t border-hair py-3.5" key={job.id}>
          <b>{job.title}</b>
          {job.review ? (
            <>
              <div className="flex items-center gap-2">
                <Stars rating={job.review.rating} />
                <span>{job.review.rating.toFixed(1)}</span>
              </div>
              <p className="mt-1 text-[13px]">“{job.review.comment}”</p>
              {job.review.endorsements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.review.endorsements.map((e) => (
                    <Pill key={e}>{e}</Pill>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">Awaiting client review.</p>
          )}
          <div className="text-muted">
            ${job.amount} · {priceLabel(job.jobType)}
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
