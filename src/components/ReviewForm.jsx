import { useState } from 'react';
import Button from './ui/Button.jsx';
import * as reviewsApi from '../api/reviews.js';
import { getErrorMessage } from '../api/client.js';

const ENDORSEMENTS = [
  'Clear Communicator', 'Committed to Quality', 'Reliable', 'Solution Oriented',
  'Collaborative', 'Detail Oriented', 'Accountable for Outcomes',
];

export default function ReviewForm({ jobId, onDone }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [picked, setPicked] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function toggle(tag) {
    setPicked((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await reviewsApi.createReview(jobId, { rating, comment, endorsements: picked });
      onDone();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={submit}>
      <h3>Leave a review</h3>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Comment
        <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      <div>
        <div className="mb-1.5 text-muted">Endorsements</div>
        <div className="flex flex-wrap gap-2">
          {ENDORSEMENTS.map((tag) => (
            <button type="button" key={tag} onClick={() => toggle(tag)} className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium ${picked.includes(tag) ? 'bg-brand-soft text-brand' : 'bg-chip text-ink hover:bg-hair'}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit review'}</Button>
    </form>
  );
}
