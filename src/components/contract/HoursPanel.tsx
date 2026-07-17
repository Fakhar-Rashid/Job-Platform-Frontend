import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { X } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useContractAction, useHoursActions } from '../../hooks/queries/useContracts';
import { getErrorMessage } from '../../api/client';
import { payoutAfterFee, todayISO } from '../../utils/format';
import type { ContractDetail } from '../../types';

type Role = 'client' | 'freelancer';

function ErrorNote({ err }: { err: unknown }) {
  if (err == null) return null;
  const needsFunds = isAxiosError(err) && err.response?.status === 402;
  return (
    <p className="text-danger text-sm">
      {getErrorMessage(err)}{' '}
      {needsFunds && (
        <Link to="/settings" className="font-semibold text-danger underline">
          Add funds
        </Link>
      )}
    </p>
  );
}

function LogForm({ log }: { log: ReturnType<typeof useHoursActions>['log'] }) {
  const [date, setDate] = useState(todayISO());
  const [hours, setHours] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const parsed = Number(hours);
    if (!date || !parsed || !memo.trim()) {
      setError('Fill in date, hours, and memo.');
      return;
    }
    try {
      await log.mutateAsync({ date, hours: parsed, memo });
      setHours('');
      setMemo('');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="mt-4 flex flex-col gap-2 border-t border-hair pt-4" onSubmit={submit}>
      <div className="flex flex-wrap gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input
          type="number"
          step={0.5}
          min={0.5}
          max={24}
          placeholder="Hours"
          className="w-24"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <input
          placeholder="Memo"
          className="min-w-40 flex-1"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        <Button type="submit" disabled={log.isPending}>
          {log.isPending ? 'Logging…' : 'Log hours'}
        </Button>
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
    </form>
  );
}

export default function HoursPanel({ contract, role }: { contract: ContractDetail; role: Role }) {
  const { log, remove } = useHoursActions(contract.id);
  const { payHours } = useContractAction(contract.id);
  const [removeError, setRemoveError] = useState('');
  const [payError, setPayError] = useState<unknown>(null);
  const active = contract.status === 'ACTIVE';
  const rate = contract.hourlyRate ?? 0;
  const unpaidHours = contract.timeEntries
    .filter((e) => e.status === 'LOGGED')
    .reduce((sum, e) => sum + e.hours, 0);
  const unpaidTotal = Math.round(unpaidHours * rate);

  async function removeEntry(entryId: string) {
    setRemoveError('');
    try {
      await remove.mutateAsync(entryId);
    } catch (err) {
      setRemoveError(getErrorMessage(err));
    }
  }

  async function pay() {
    setPayError(null);
    try {
      await payHours.mutateAsync();
    } catch (err) {
      setPayError(err);
    }
  }

  return (
    <Card>
      <h3 className="mb-3">Hours</h3>
      {contract.timeEntries.length === 0 ? (
        <p className="text-muted text-sm">No hours logged yet.</p>
      ) : (
        <div className="flex flex-col">
          {contract.timeEntries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 border-b border-hair py-2.5 text-sm last:border-b-0">
              <span className="w-24 shrink-0">{entry.date}</span>
              <span className="w-12 shrink-0 font-medium">{entry.hours}h</span>
              <span className="min-w-0 flex-1 truncate text-muted">{entry.memo}</span>
              <Badge variant={entry.status === 'PAID' ? 'open' : 'neutral'}>
                {entry.status === 'PAID' ? 'Paid' : 'Unpaid'}
              </Badge>
              {role === 'freelancer' && entry.status === 'LOGGED' && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete entry"
                  onClick={() => removeEntry(entry.id)}
                  disabled={remove.isPending}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {removeError && <p className="mt-2 text-danger text-sm">{removeError}</p>}
      {contract.timeEntries.length > 0 && (
        <p className="mt-3 font-semibold">
          Unpaid: {unpaidHours}h · ${unpaidTotal}
        </p>
      )}
      {role === 'client' && active && unpaidTotal > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          <Button className="self-start" onClick={pay} disabled={payHours.isPending}>
            {payHours.isPending ? 'Paying…' : `Pay $${unpaidTotal} for ${unpaidHours} hours`}
          </Button>
          <p className="text-muted text-sm">
            {contract.freelancer.name} receives ${payoutAfterFee(unpaidTotal)} after the 10% fee.
          </p>
          <ErrorNote err={payError} />
        </div>
      )}
      {role === 'freelancer' && active && <LogForm log={log} />}
    </Card>
  );
}
