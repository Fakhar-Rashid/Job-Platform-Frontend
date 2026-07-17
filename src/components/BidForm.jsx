import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Button from './ui/Button.jsx';
import * as bidsApi from '../api/bids.js';
import { getErrorMessage } from '../api/client.js';

export default function BidForm({ jobId, onBid }) {
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ amount: '', coverLetter: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await bidsApi.placeBid(jobId, form);
      await refreshUser();
      onBid();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="flex max-w-md flex-col gap-3.5" onSubmit={handleSubmit}>
      <h3>Place a bid</h3>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Your offer ($)
        <input name="amount" type="number" min="1" value={form.amount} onChange={update} required />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">Cover letter
        <textarea name="coverLetter" rows="4" value={form.coverLetter} onChange={update} required />
      </label>
      {error && <p className="text-danger text-sm">{error}</p>}
      <Button type="submit" disabled={busy}>Bid (costs 5 connects)</Button>
    </form>
  );
}
