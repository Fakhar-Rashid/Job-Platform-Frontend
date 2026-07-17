import { useState } from 'react';
import type { FormEvent } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import Stars from '../profile/Stars';
import { useContractAction } from '../../hooks/queries/useContracts';
import { getErrorMessage } from '../../api/client';
import type { ContractDetail } from '../../types';

type Role = 'client' | 'freelancer';
type FeedbackMutation = ReturnType<typeof useContractAction>['feedback'];

const ENDORSEMENTS = [
  'Clear Communicator',
  'Committed to Quality',
  'Reliable',
  'Solution Oriented',
  'Collaborative',
  'Detail Oriented',
  'Accountable for Outcomes',
];

function RatingSelect({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      Rating
      <select value={rating} onChange={(e) => onChange(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? 's' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}

function FeedbackForm({ feedback, withEndorsements }: { feedback: FeedbackMutation; withEndorsements: boolean }) {
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
      await feedback.mutateAsync(
        withEndorsements ? { rating, comment, endorsements: picked } : { rating, comment },
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={submit}>
      <RatingSelect rating={rating} onChange={setRating} />
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Comment
        <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      {withEndorsements && (
        <div>
          <div className="mb-1.5 text-muted">Endorsements</div>
          <div className="flex flex-wrap gap-2">
            {ENDORSEMENTS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggle(tag)}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium ${picked.includes(tag) ? 'bg-brand-soft text-brand' : 'bg-chip text-ink hover:bg-hair'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" className="self-start" disabled={feedback.isPending}>
        {feedback.isPending ? 'Submitting…' : 'Submit feedback'}
      </Button>
    </form>
  );
}

interface FeedbackBlockProps {
  author: string;
  recipient: string;
  rating: number;
  comment: string;
  endorsements?: string[];
}

function FeedbackBlock({ author, recipient, rating, comment, endorsements }: FeedbackBlockProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-muted">
        {author} → {recipient}
      </p>
      <Stars rating={rating} />
      <p className="border-l-2 border-hair pl-3 text-sm text-muted italic">{comment}</p>
      {endorsements && endorsements.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {endorsements.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeedbackPanel({ contract, role }: { contract: ContractDetail; role: Role }) {
  const { feedback } = useContractAction(contract.id);
  const myGiven = role === 'client' ? contract.review : contract.clientFeedback;
  const otherGiven = role === 'client' ? contract.clientFeedback : contract.review;
  const otherName = role === 'client' ? contract.freelancer.name : contract.client.name;

  return (
    <Card>
      <h3 className="mb-3">Feedback</h3>
      <div className="flex flex-col gap-5">
        {!myGiven && <FeedbackForm feedback={feedback} withEndorsements={role === 'client'} />}
        {contract.review && (
          <FeedbackBlock
            author={contract.review.author?.name ?? contract.client.name}
            recipient={contract.freelancer.name}
            rating={contract.review.rating}
            comment={contract.review.comment}
            endorsements={contract.review.endorsements}
          />
        )}
        {contract.clientFeedback && (
          <FeedbackBlock
            author={contract.freelancer.name}
            recipient={contract.client.name}
            rating={contract.clientFeedback.rating}
            comment={contract.clientFeedback.comment}
          />
        )}
        {!otherGiven && <p className="text-muted text-sm">{`Awaiting ${otherName}'s feedback.`}</p>}
      </div>
    </Card>
  );
}
