import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import { usePlaceBid } from '../hooks/queries/useBids';
import { getErrorMessage } from '../api/client';

interface BidFormProps {
  jobId: string;
  onBid: () => void;
}

export default function BidForm({ jobId, onBid }: BidFormProps) {
  const { refreshUser } = useAuth();
  const placeBid = usePlaceBid(jobId);
  const [form, setForm] = useState({ amount: '', coverLetter: '' });
  const [error, setError] = useState('');

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await placeBid.mutateAsync({ amount: Number(form.amount), coverLetter: form.coverLetter });
      await refreshUser();
      onBid();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={handleSubmit}>
      <h3>Place a bid</h3>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Your offer ($)
        <input name="amount" type="number" min="1" value={form.amount} onChange={update} required />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Cover letter
        <textarea name="coverLetter" rows={4} value={form.coverLetter} onChange={update} required />
      </label>
      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" disabled={placeBid.isPending}>
        Bid (costs 5 connects)
      </Button>
    </form>
  );
}
