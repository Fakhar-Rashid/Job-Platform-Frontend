import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/profile/Modal';
import OfferPanel from '../components/contract/OfferPanel';
import MilestonePanel from '../components/contract/MilestonePanel';
import HoursPanel from '../components/contract/HoursPanel';
import FeedbackPanel from '../components/contract/FeedbackPanel';
import { useContract, useContractAction } from '../hooks/queries/useContracts';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import { CONTRACT_STATUS_LABEL } from '../utils/format';
import { avatarFor } from '../utils/avatar';
import type { ContractParty } from '../types';

function Party({ person, caption }: { person: ContractParty; caption: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={avatarFor(person)} alt={person.name} className="h-10 w-10 rounded-full object-cover" />
      <div>
        <div className="text-sm font-medium">{person.name}</div>
        <div className="text-xs text-muted">{caption}</div>
      </div>
    </div>
  );
}

export default function ContractRoomPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { data: contract, error, isLoading } = useContract(id);
  const { end } = useContractAction(id);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [endError, setEndError] = useState('');

  if (error) return <p className="text-danger text-sm">{getErrorMessage(error)}</p>;
  if (isLoading || !contract || !user) return <p className="text-muted">Loading…</p>;

  const role: 'client' | 'freelancer' = user.id === contract.clientId ? 'client' : 'freelancer';
  const badgeVariant =
    contract.status === 'ACTIVE' ? 'open' : contract.status === 'ENDED' ? 'closed' : 'neutral';

  async function endContract() {
    setEndError('');
    try {
      await end.mutateAsync();
      setConfirmEnd(false);
    } catch (err) {
      setEndError(getErrorMessage(err));
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/jobs/${contract.jobId}`} className="text-xl font-semibold">
              {contract.job.title}
            </Link>
            <div className="mt-1.5">
              <Badge variant={badgeVariant}>{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
            </div>
          </div>
          {contract.status === 'ACTIVE' && (
            <Button
              variant="outline"
              className="border-danger text-danger hover:bg-red-50"
              onClick={() => setConfirmEnd(true)}
            >
              End contract
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <Party person={contract.client} caption="Client" />
          <Party person={contract.freelancer} caption="Freelancer" />
        </div>
        <p className="mt-3 text-sm font-medium">
          {contract.type === 'HOURLY'
            ? `Hourly · $${(contract.hourlyRate ?? 0).toFixed(2)}/hr`
            : 'Fixed price'}
        </p>
        {contract.offerMessage && (
          <p className="mt-2 border-l-2 border-hair pl-3 text-sm text-muted italic">
            {contract.offerMessage}
          </p>
        )}
      </Card>
      {contract.status === 'OFFERED' && <OfferPanel contract={contract} role={role} />}
      {(contract.status === 'ACTIVE' || contract.status === 'ENDED') &&
        (contract.type === 'FIXED' ? (
          <MilestonePanel contract={contract} role={role} />
        ) : (
          <HoursPanel contract={contract} role={role} />
        ))}
      {contract.status === 'ENDED' && <FeedbackPanel contract={contract} role={role} />}
      {contract.status === 'DECLINED' && (
        <Card>
          <p className="text-muted">This offer was declined.</p>
        </Card>
      )}
      {contract.status === 'WITHDRAWN' && (
        <Card>
          <p className="text-muted">This offer was withdrawn.</p>
        </Card>
      )}
      {confirmEnd && (
        <Modal title="End contract" onClose={() => setConfirmEnd(false)}>
          <p className="text-sm">End this contract? Unreleased escrow returns to the client.</p>
          {endError && <p className="mt-2 text-danger text-sm">{endError}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmEnd(false)}>
              Cancel
            </Button>
            <Button
              className="bg-danger hover:bg-danger/90"
              onClick={endContract}
              disabled={end.isPending}
            >
              {end.isPending ? 'Ending…' : 'End contract'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
