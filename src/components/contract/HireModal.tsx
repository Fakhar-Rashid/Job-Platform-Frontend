import { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../profile/Modal';
import Button from '../ui/Button';
import { useHire } from '../../hooks/queries/useContracts';
import { getErrorMessage } from '../../api/client';
import { serviceFee } from '../../utils/format';
import type { HirePayload } from '../../api/contracts';
import type { Bid, JobDetail } from '../../types';

interface HireModalProps {
  job: JobDetail;
  bid: Bid;
  onClose: () => void;
}

interface MilestoneRow {
  description: string;
  amount: string;
}

export default function HireModal({ job, bid, onClose }: HireModalProps) {
  const hourly = job.jobType === 'HOURLY';
  const [rate, setRate] = useState(String(bid.amount));
  const [rows, setRows] = useState<MilestoneRow[]>([
    { description: 'Project delivery', amount: String(job.budget ?? bid.amount) },
  ]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const hire = useHire();

  const total = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const valid = hourly
    ? Number(rate) > 0
    : rows.length >= 1 && rows.every((row) => row.description.trim().length >= 3 && Number(row.amount) > 0);

  function updateRow(index: number, patch: Partial<MilestoneRow>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function submit() {
    setError('');
    const payload: HirePayload = { bidId: bid.id };
    if (hourly) payload.hourlyRate = Number(rate);
    else payload.milestones = rows.map((row) => ({ description: row.description.trim(), amount: Number(row.amount) }));
    if (message.trim()) payload.message = message.trim();
    try {
      await hire.mutateAsync(payload);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Modal title="Send an offer" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <p>
          To: <strong>{bid.freelancer?.name ?? 'Freelancer'}</strong>
        </p>

        {hourly ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="hire-rate">
              Hourly rate
            </label>
            <div className="flex items-center gap-2">
              <span>$</span>
              <input
                id="hire-rate"
                type="number"
                min="1"
                className="w-32"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="text-muted">/hr</span>
            </div>
            <p className="text-sm text-muted">
              Freelancer receives ${serviceFee(Number(rate) || 0).receives}/hr after the 10% service fee
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Milestones</span>
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="min-w-0 flex-1"
                  placeholder="Description"
                  value={row.description}
                  onChange={(e) => updateRow(index, { description: e.target.value })}
                />
                <span>$</span>
                <input
                  type="number"
                  min="1"
                  className="w-24"
                  placeholder="Amount"
                  value={row.amount}
                  onChange={(e) => updateRow(index, { amount: e.target.value })}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove milestone"
                  disabled={rows.length <= 1}
                  onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRows((prev) => [...prev, { description: '', amount: '' }])}
              >
                + Add milestone
              </Button>
            </div>
            <p className="font-semibold">Total: ${total}</p>
          </div>
        )}

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Message
          <textarea
            rows={3}
            placeholder="Optional message to the freelancer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex items-center gap-3">
          <Button onClick={submit} disabled={hire.isPending || !valid}>
            {hire.isPending ? 'Sending…' : 'Send offer'}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
