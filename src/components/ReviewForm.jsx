import { useState } from 'react';
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
    <form className="stack" onSubmit={submit}>
      <h3>Leave a review</h3>
      <label>Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
        </select>
      </label>
      <label>Comment
        <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      <div>
        <div className="muted" style={{ marginBottom: 6 }}>Endorsements</div>
        <div className="pills">
          {ENDORSEMENTS.map((tag) => (
            <button type="button" key={tag} className={`pill-toggle ${picked.includes(tag) ? 'on' : ''}`} onClick={() => toggle(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit review'}</button>
    </form>
  );
}
