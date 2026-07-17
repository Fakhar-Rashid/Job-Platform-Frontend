import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Pill from '../ui/Pill';
import { ErrorNote, MilestoneFormModal, NoteModal } from './MilestoneModals';
import { useMilestoneActions } from '../../hooks/queries/useContracts';
import { MILESTONE_STATUS_LABEL, payoutAfterFee } from '../../utils/format';
import type { ContractDetail, Milestone } from '../../types';

type Role = 'client' | 'freelancer';
type Actions = ReturnType<typeof useMilestoneActions>;

function MilestoneRow({ milestone, role, active, actions }: { milestone: Milestone; role: Role; active: boolean; actions: Actions }) {
  const [err, setErr] = useState<unknown>(null);
  const [modal, setModal] = useState<'edit' | 'submit' | 'changes' | null>(null);
  const cancelled = milestone.status === 'CANCELLED';
  const badgeVariant = milestone.status === 'APPROVED' ? 'open' : cancelled ? 'closed' : 'neutral';

  async function run(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <div className={`flex flex-col gap-2 border-b border-hair py-3 last:border-b-0 ${cancelled ? 'text-muted line-through opacity-70' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm">
          {milestone.order + 1}. {milestone.description}
        </span>
        <span className="flex items-center gap-2">
          <span className="font-semibold">${milestone.amount}</span>
          <Badge variant={badgeVariant}>{MILESTONE_STATUS_LABEL[milestone.status]}</Badge>
        </span>
      </div>
      {role === 'freelancer' && !cancelled && (
        <p className="text-xs text-muted">{`You'll receive $${payoutAfterFee(milestone.amount)}`}</p>
      )}
      {milestone.submissionMessage && <p className="text-sm text-muted">{milestone.submissionMessage}</p>}
      {milestone.status === 'CHANGES_REQUESTED' && milestone.changeRequest && (
        <p className="text-danger text-sm">{milestone.changeRequest}</p>
      )}
      {active && role === 'client' && milestone.status === 'PENDING' && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => run(() => actions.fund.mutateAsync(milestone.id))} disabled={actions.fund.isPending}>
            Fund milestone
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setModal('edit')}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => run(() => actions.remove.mutateAsync(milestone.id))} disabled={actions.remove.isPending}>
            Delete
          </Button>
        </div>
      )}
      {active && role === 'client' && milestone.status === 'SUBMITTED' && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => run(() => actions.approve.mutateAsync(milestone.id))} disabled={actions.approve.isPending}>
            {'Approve & pay'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setModal('changes')}>
            Request changes
          </Button>
        </div>
      )}
      {active && role === 'freelancer' && (milestone.status === 'FUNDED' || milestone.status === 'CHANGES_REQUESTED') && (
        <div>
          <Button size="sm" onClick={() => setModal('submit')}>
            Submit work
          </Button>
        </div>
      )}
      <ErrorNote err={err} />
      {modal === 'edit' && (
        <MilestoneFormModal
          title="Edit milestone"
          initial={{ description: milestone.description, amount: milestone.amount }}
          pending={actions.update.isPending}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            await actions.update.mutateAsync({ id: milestone.id, ...data });
            setModal(null);
          }}
        />
      )}
      {modal === 'submit' && (
        <NoteModal
          title="Submit work"
          label="Message"
          cta="Submit"
          pending={actions.submit.isPending}
          onClose={() => setModal(null)}
          onSave={async (message) => {
            await actions.submit.mutateAsync({ id: milestone.id, message });
            setModal(null);
          }}
        />
      )}
      {modal === 'changes' && (
        <NoteModal
          title="Request changes"
          label="What needs to change?"
          cta="Send request"
          pending={actions.requestChanges.isPending}
          onClose={() => setModal(null)}
          onSave={async (note) => {
            await actions.requestChanges.mutateAsync({ id: milestone.id, note });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

export default function MilestonePanel({ contract, role }: { contract: ContractDetail; role: Role }) {
  const actions = useMilestoneActions(contract.id);
  const [adding, setAdding] = useState(false);
  const active = contract.status === 'ACTIVE';
  const sorted = [...contract.milestones].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3>Milestones</h3>
        <div className="flex gap-2">
          <Pill>In escrow ${contract.escrow.funded}</Pill>
          <Pill>Released ${contract.escrow.released}</Pill>
        </div>
      </div>
      <div className="flex flex-col">
        {sorted.map((m) => (
          <MilestoneRow key={m.id} milestone={m} role={role} active={active} actions={actions} />
        ))}
      </div>
      {role === 'client' && active && (
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            + Add milestone
          </Button>
        </div>
      )}
      {adding && (
        <MilestoneFormModal
          title="Add milestone"
          pending={actions.add.isPending}
          onClose={() => setAdding(false)}
          onSave={async (data) => {
            await actions.add.mutateAsync(data);
            setAdding(false);
          }}
        />
      )}
    </Card>
  );
}
