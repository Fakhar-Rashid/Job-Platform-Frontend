import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import BidForm from '../components/BidForm.jsx';
import BidCard from '../components/BidCard.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import Stars from '../components/profile/Stars.jsx';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import * as jobsApi from '../api/jobs.js';
import * as bidsApi from '../api/bids.js';
import * as reviewsApi from '../api/reviews.js';
import { getErrorMessage } from '../api/client.js';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isOwner = user && job && user.id === job.owner?.id;

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await jobsApi.getJob(id);
      setJob(data);
      if (user && user.id === data.owner?.id) {
        setBids(await bidsApi.jobBids(id));
      }
      setReview(data.status === 'CLOSED' ? await reviewsApi.getReview(id) : null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [id, user]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAccept(bidId) {
    try {
      await bidsApi.acceptBid(bidId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (error && !job) return <p className="text-danger text-sm">{error}</p>;
  if (!job) return <p className="text-muted">Loading…</p>;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>{job.title}</h2>
        <Badge variant={job.status.toLowerCase()}>{job.status}</Badge>
      </div>
      <p>{job.description}</p>
      <p className="text-muted">Budget: ${job.budget} · Posted by {job.owner?.name}</p>
      {error && <p className="text-danger text-sm">{error}</p>}
      {notice && <p className="text-muted">{notice}</p>}

      {isOwner ? (
        <section>
          <h3>Bids ({bids.length})</h3>
          {bids.length === 0 && <p className="text-muted">No bids yet.</p>}
          {bids.map((bid) => (
            <BidCard key={bid.id} bid={bid} canAccept={job.status === 'OPEN'} onAccept={handleAccept} />
          ))}
        </section>
      ) : user && job.status === 'OPEN' ? (
        <BidForm jobId={job.id} onBid={() => { setNotice('Your bid was submitted.'); load(); }} />
      ) : !user ? (
        <p className="text-muted">Log in to place a bid.</p>
      ) : (
        <p className="text-muted">This job is closed.</p>
      )}

      {job.status === 'CLOSED' && review && (
        <Card>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />
            <b>{review.rating.toFixed(1)}</b>
          </div>
          <p className="mt-1 text-[13px]">“{review.comment}”</p>
          <p className="text-muted">— {review.author?.name}</p>
        </Card>
      )}

      {isOwner && job.status === 'CLOSED' && !review && (
        <Card>
          <ReviewForm jobId={job.id} onDone={() => { setNotice('Review submitted.'); load(); }} />
        </Card>
      )}
    </>
  );
}
