import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import BidForm from '../components/BidForm.jsx';
import BidCard from '../components/BidCard.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import Stars from '../components/profile/Stars.jsx';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import { useJob } from '../hooks/queries/useJobs.js';
import { useJobBids, useAcceptBid } from '../hooks/queries/useBids.js';
import { useReview } from '../hooks/queries/useReview.js';
import { getErrorMessage } from '../api/client.js';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [notice, setNotice] = useState('');

  const { data: job, error, isLoading } = useJob(id);
  const isOwner = user && job && user.id === job.owner?.id;
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
        <Badge variant={job.status.toLowerCase()}>{job.status}</Badge>
      </div>
      <p>{job.description}</p>
      <p className="text-muted">Budget: ${job.budget} · Posted by {job.owner?.name}</p>
      {notice && <p className="text-muted">{notice}</p>}

      {isOwner ? (
        <section>
          <h3>Bids ({bids.length})</h3>
          {bids.length === 0 && <p className="text-muted">No bids yet.</p>}
          {bids.map((bid) => (
            <BidCard key={bid.id} bid={bid} canAccept={job.status === 'OPEN'} onAccept={(bidId) => acceptBid.mutate(bidId)} />
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
