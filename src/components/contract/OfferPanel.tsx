import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useContractAction } from '../../hooks/queries/useContracts';
import { getErrorMessage } from '../../api/client';
import type { ContractDetail } from '../../types';

interface OfferPanelProps {
  contract: ContractDetail;
  role: 'client' | 'freelancer';
}

export default function OfferPanel({ contract, role }: OfferPanelProps) {
  const { accept, decline, withdraw } = useContractAction(contract.id);
  const [error, setError] = useState('');
  const total = contract.milestones.reduce((sum, m) => sum + m.amount, 0);

  async function run(action: { mutateAsync: () => Promise<unknown> }) {
    setError('');
    try {
      await action.mutateAsync();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Card>
      <h3 className="mb-3">Offer</h3>
      {contract.type === 'HOURLY' ? (
        <p className="text-sm">Hourly · ${(contract.hourlyRate ?? 0).toFixed(2)}/hr</p>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm">
          {contract.milestones.map((m) => (
            <div key={m.id} className="flex justify-between gap-3">
              <span>{m.description}</span>
              <span className="font-semibold">${m.amount}</span>
            </div>
          ))}
          <div className="mt-1 flex justify-between border-t border-hair pt-2 font-semibold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
      {role === 'freelancer' ? (
        <>
          <p className="mt-3 text-sm text-muted">
            {"You'll receive amounts minus the 10% service fee."}
          </p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => run(accept)} disabled={accept.isPending}>
              {accept.isPending ? 'Accepting…' : 'Accept offer'}
            </Button>
            <Button variant="secondary" onClick={() => run(decline)} disabled={decline.isPending}>
              Decline
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          <p className="text-sm text-muted">Waiting for {contract.freelancer.name} to respond.</p>
          <Button
            variant="outline"
            className="self-start"
            onClick={() => run(withdraw)}
            disabled={withdraw.isPending}
          >
            Withdraw offer
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-danger text-sm">{error}</p>}
    </Card>
  );
}
