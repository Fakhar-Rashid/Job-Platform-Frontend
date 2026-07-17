import SectionCard from './SectionCard.jsx';
import Stars from './Stars.jsx';
import * as profileApi from '../../api/profile.js';

function priceLabel(type) {
  return type === 'HOURLY' ? 'Hourly' : 'Fixed price';
}

export default function WorkHistorySection({ profile, editable, onChanged }) {
  const { completedJobs, insights, showWorkHistory } = profile;

  if (!editable && !showWorkHistory) return null;

  async function toggle(event) {
    await profileApi.updateCore({ showWorkHistory: event.target.checked });
    onChanged();
  }

  return (
    <SectionCard title="Work history">
      {editable && (
        <label className="mini-row">
          <span>Show work history on public profile</span>
          <input type="checkbox" checked={showWorkHistory} onChange={toggle} />
        </label>
      )}

      {insights.length > 0 && (
        <>
          <h4 className="sub-head">Insights from completed jobs</h4>
          <div className="pills">
            {insights.map((i) => <span className="pill" key={i.label}>{i.label} {i.count}</span>)}
          </div>
        </>
      )}

      <h4 className="sub-head">Completed jobs ({completedJobs.length})</h4>
      {completedJobs.length === 0 && <p className="muted">No completed jobs yet.</p>}
      {completedJobs.map((job) => (
        <div className="completed-job" key={job.id}>
          <b>{job.title}</b>
          {job.review ? (
            <>
              <div className="row" style={{ gap: 8 }}>
                <Stars rating={job.review.rating} />
                <span>{job.review.rating.toFixed(1)}</span>
              </div>
              <p className="section-sub">“{job.review.comment}”</p>
              {job.review.endorsements.length > 0 && (
                <div className="pills">
                  {job.review.endorsements.map((e) => <span className="pill" key={e}>{e}</span>)}
                </div>
              )}
            </>
          ) : (
            <p className="muted">Awaiting client review.</p>
          )}
          <div className="muted">${job.amount} · {priceLabel(job.jobType)}</div>
        </div>
      ))}
    </SectionCard>
  );
}
