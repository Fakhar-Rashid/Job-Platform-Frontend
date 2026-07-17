import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Pill from '../ui/Pill';
import Button from '../ui/Button';
import BidCard from '../BidCard';
import HireModal from '../contract/HireModal';
import { useJobBids } from '../../hooks/queries/useBids';
import { jobRateLabel } from '../../utils/format';
import type { Bid, ContractStatus, JobDetail } from '../../types';

interface ManageJobViewProps {
  job: JobDetail;
}

const CONTRACT_ACTION: Partial<Record<ContractStatus, { badge: React.ReactNode; link: string }>> = {
  OFFERED: { badge: <Badge>Offer sent</Badge>, link: 'View offer' },
  ACTIVE: { badge: <Badge variant="open">Hired</Badge>, link: 'View contract' },
  ENDED: { badge: <Badge>Contract ended</Badge>, link: 'View contract' },
};

export default function ManageJobView({ job }: ManageJobViewProps) {
  const [hiringBid, setHiringBid] = useState<Bid | null>(null);
  const { data: bids = [] } = useJobBids(job.id, true);

  function bidAction(bid: Bid): React.ReactNode {
    const contract = bid.contracts?.[0];
    if (!contract) {
      if (job.status !== 'OPEN') return null;
      return (
        <Button size="sm" onClick={() => setHiringBid(bid)}>
          Hire
        </Button>
      );
    }
    const entry = CONTRACT_ACTION[contract.status];
    if (!entry) return null;
    return (
      <span className="flex items-center gap-3">
        {entry.badge}
        <Link className="font-medium text-brand" to={`/contracts/${contract.id}`}>
          {entry.link}
        </Link>
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2>{job.title}</h2>
        <Badge variant={job.status.toLowerCase() as 'open' | 'closed'}>{job.status}</Badge>
      </div>
      <p>{job.description}</p>
      <p className="text-muted">
        {job.jobType === 'HOURLY' ? 'Rate' : 'Budget'}: {jobRateLabel(job)}
      </p>

      <section className="flex flex-col gap-3">
        <h3>Proposals ({bids.length})</h3>
        {bids.length === 0 && <p className="text-muted">No proposals yet.</p>}
        {bids.map((bid: Bid) => (
          <div key={bid.id} className="flex flex-col gap-1">
            {bid.boostConnects > 0 && (
              <div>
                <Pill className="ml-2">Boosted</Pill>
              </div>
            )}
            <BidCard bid={bid} action={bidAction(bid)} />
          </div>
        ))}
      </section>

      {hiringBid && <HireModal job={job} bid={hiringBid} onClose={() => setHiringBid(null)} />}
    </>
  );
}
