import { useState } from 'react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Pill from '../ui/Pill';
import BidCard from '../BidCard';
import ReviewForm from '../ReviewForm';
import Stars from '../profile/Stars';
import { useJobBids, useAcceptBid } from '../../hooks/queries/useBids';
import { useReview } from '../../hooks/queries/useReview';
import { jobRateLabel } from '../../utils/format';
import type { Bid, JobDetail } from '../../types';

interface ManageJobViewProps {
  job: JobDetail;
}

export default function ManageJobView({ job }: ManageJobViewProps) {
  const [notice, setNotice] = useState('');
  const closed = job.status === 'CLOSED';

  const { data: bids = [] } = useJobBids(job.id, true);
  const { data: review } = useReview(job.id, closed);
  const acceptBid = useAcceptBid(job.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>{job.title}</h2>
        <Badge variant={job.status.toLowerCase() as 'open' | 'closed'}>{job.status}</Badge>
      </div>
      <p>{job.description}</p>
      <p className="text-muted">
        {job.jobType === 'HOURLY' ? 'Rate' : 'Budget'}: {jobRateLabel(job)}
      </p>
      {notice && <p className="text-muted">{notice}</p>}

      <section className="flex flex-col gap-3">
        <h3>Proposals ({bids.length})</h3>
        {bids.length === 0 && <p className="text-muted">No proposals yet.</p>}
        {bids.map((bid: Bid) => (
          <div key={bid.id} className="flex flex-col gap-1">
            {bid.boostConnects > 0 && (
              <div>
                <Pill className="ml-2">Boosted</Pill>
              </div>
            )}
            <BidCard
              bid={bid}
              canAccept={job.status === 'OPEN'}
              onAccept={(bidId: string) => acceptBid.mutate(bidId)}
            />
          </div>
        ))}
      </section>

      {closed && review && (
        <Card>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />
            <b>{review.rating.toFixed(1)}</b>
          </div>
          <p className="mt-1 text-[13px]">“{review.comment}”</p>
          <p className="text-muted">— {review.author?.name}</p>
        </Card>
      )}

      {closed && !review && (
        <Card>
          <ReviewForm jobId={job.id} onDone={() => setNotice('Review submitted.')} />
        </Card>
      )}
    </>
  );
}
