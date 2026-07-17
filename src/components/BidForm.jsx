import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
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
    <form className="stack" onSubmit={handleSubmit}>
      <h3>Place a bid</h3>
      <label>Your offer ($)
        <input name="amount" type="number" min="1" value={form.amount} onChange={update} required />
      </label>
      <label>Cover letter
        <textarea name="coverLetter" rows="4" value={form.coverLetter} onChange={update} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>Bid (costs 5 connects)</button>
    </form>
  );
}
