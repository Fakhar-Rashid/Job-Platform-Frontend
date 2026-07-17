import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BidForm from '../components/BidForm';
import BidCard from '../components/BidCard';
import ReviewForm from '../components/ReviewForm';
import Stars from '../components/profile/Stars';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useJob } from '../hooks/queries/useJobs';
import { useJobBids, useAcceptBid } from '../hooks/queries/useBids';
import { useReview } from '../hooks/queries/useReview';
import { getErrorMessage } from '../api/client';
import type { Bid } from '../types';

export default function JobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const [notice, setNotice] = useState('');

  const { data: job, error, isLoading } = useJob(id);
  const isOwner = Boolean(user && job && user.id === job.owner?.id);
  const closed = job?.status === 'CLOSED';

  const { data: bids = [] } = useJobBids(id, isOwner);
  const { data: review } = useReview(id, closed);
  const acceptBid = useAcceptBid(id);

  if (error) return <p className="text-danger text-sm">{getErrorMessage(error)}</p>;
  if (isLoading || !job) return <p className="text-muted">Loading…</p>;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>{job.title}</h2>
        <Badge variant={job.status.toLowerCase() as 'open' | 'closed'}>{job.status}</Badge>
      </div>
      <p>{job.description}</p>
      <p className="text-muted">
        Budget: ${job.budget} · Posted by {job.owner?.name}
      </p>
      {notice && <p className="text-muted">{notice}</p>}

      {isOwner ? (
        <section>
          <h3>Bids ({bids.length})</h3>
          {bids.length === 0 && <p className="text-muted">No bids yet.</p>}
          {bids.map((bid: Bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              canAccept={job.status === 'OPEN'}
              onAccept={(bidId: string) => acceptBid.mutate(bidId)}
            />
          ))}
        </section>
      ) : user && job.status === 'OPEN' ? (
        <BidForm jobId={job.id} onBid={() => setNotice('Your bid was submitted.')} />
      ) : !user ? (
        <p className="text-muted">Log in to place a bid.</p>
      ) : (
        <p className="text-muted">This job is closed.</p>
      )}

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

      {isOwner && closed && !review && (
        <Card>
          <ReviewForm jobId={job.id} onDone={() => setNotice('Review submitted.')} />
        </Card>
      )}
    </>
  );
}
