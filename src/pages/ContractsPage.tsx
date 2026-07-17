import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useContracts } from '../hooks/queries/useContracts';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/client';
import { avatarFor } from '../utils/avatar';
import { timeAgo, CONTRACT_STATUS_LABEL } from '../utils/format';
import type { Contract, ContractStatus } from '../types';

const TABS = ['Offers', 'Active', 'Ended'] as const;
type Tab = (typeof TABS)[number];

const TAB_STATUSES: Record<Tab, ContractStatus[]> = {
  Offers: ['OFFERED'],
  Active: ['ACTIVE'],
  Ended: ['ENDED', 'DECLINED', 'WITHDRAWN'],
};

const EMPTY_TEXT: Record<Tab, string> = {
  Offers: 'No offers right now.',
  Active: 'No active contracts.',
  Ended: 'No ended contracts.',
};

function badgeVariant(status: ContractStatus): 'open' | 'closed' | 'neutral' {
  if (status === 'ACTIVE') return 'open';
  if (status === 'ENDED') return 'closed';
  return 'neutral';
}

function typeLine(contract: Contract): string {
  if (contract.type === 'HOURLY') return `Hourly · $${(contract.hourlyRate ?? 0).toFixed(2)}/hr`;
  const total = contract.milestones.reduce((sum, m) => sum + m.amount, 0);
  return `Fixed price · $${total}`;
}

export default function ContractsPage() {
  const [tab, setTab] = useState<Tab>('Offers');
  const { data: contracts = [], error, isLoading } = useContracts();
  const { user } = useAuth();

  const items = contracts.filter((contract) => TAB_STATUSES[tab].includes(contract.status));

  return (
    <>
      <h1 className="text-2xl">Contracts</h1>
      <div className="flex gap-6.5 border-b border-hair">
        {TABS.map((name) => (
          <button
            key={name}
            className={`-mb-px cursor-pointer border-b-2 border-transparent pb-3.5 font-semibold hover:text-ink ${tab === name ? 'border-brand text-ink' : 'text-muted'}`}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-danger">{getErrorMessage(error)}</p>}
      {isLoading ? (
        <p className="text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-muted">{EMPTY_TEXT[tab]}</p>
      ) : (
        items.map((contract) => {
          const isClient = user?.id === contract.clientId;
          const other = isClient ? contract.freelancer : contract.client;
          return (
            <Link key={contract.id} to={`/contracts/${contract.id}`} className="block hover:no-underline">
              <Card className="mb-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{contract.job.title}</span>
                  <Badge variant={badgeVariant(contract.status)}>{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-2.5">
                  <img src={avatarFor(other)} alt={other.name} className="h-9 w-9 rounded-full" />
                  <span>{other.name}</span>
                  <span className="text-muted">{isClient ? 'Freelancer' : 'Client'}</span>
                </div>
                <p className="mt-2">{typeLine(contract)}</p>
                <p className="text-muted">
                  {contract.status === 'OFFERED' ? 'Sent' : 'Started'} {timeAgo(contract.createdAt)}
                </p>
              </Card>
            </Link>
          );
        })
      )}
    </>
  );
}
