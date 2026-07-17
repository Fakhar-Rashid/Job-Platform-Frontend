import { useState } from 'react';
import type { FormEvent } from 'react';
import Button from './ui/Button';
import { useCreateReview } from '../hooks/queries/useReview';
import { getErrorMessage } from '../api/client';

const ENDORSEMENTS = [
  'Clear Communicator', 'Committed to Quality', 'Reliable', 'Solution Oriented',
  'Collaborative', 'Detail Oriented', 'Accountable for Outcomes',
];

interface ReviewFormProps {
  jobId: string;
  onDone: () => void;
}

export default function ReviewForm({ jobId, onDone }: ReviewFormProps) {
  const createReview = useCreateReview(jobId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');

  function toggle(tag: string) {
    setPicked((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await createReview.mutateAsync({ rating, comment, endorsements: picked });
      onDone();
    } catch (err) {
      setError(getErrorMessage(err));
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
        <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
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
      <Button type="submit" disabled={createReview.isPending}>{createReview.isPending ? 'Submitting…' : 'Submit review'}</Button>
    </form>
  );
}
