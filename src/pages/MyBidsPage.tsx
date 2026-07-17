import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useMyBids } from '../hooks/queries/useBids';
import { getErrorMessage } from '../api/client';
import type { Bid } from '../types';

function contractInfo(bid: Bid): React.ReactNode {
  const contract = bid.contracts?.[0];
  if (!contract) return null;
  if (contract.status === 'OFFERED') {
    return (
      <span className="flex items-center gap-2.5">
        <Badge variant="open">Offer received</Badge>
        <Link className="font-medium text-brand" to={`/contracts/${contract.id}`}>
          View offer
        </Link>
      </span>
    );
  }
  if (contract.status === 'ACTIVE') {
    return (
      <span className="flex items-center gap-2.5">
        <Badge variant="open">Hired</Badge>
        <Link className="font-medium text-brand" to={`/contracts/${contract.id}`}>
          View contract
        </Link>
      </span>
    );
  }
  if (contract.status === 'ENDED') {
    return (
      <span className="flex items-center gap-2.5">
        <Badge>Ended</Badge>
        <Link to={`/contracts/${contract.id}`}>View contract</Link>
      </span>
    );
  }
  return null;
}

export default function MyBidsPage() {
  const { data: bids = [], error, isLoading } = useMyBids();

  return (
    <>
      <h2>My bids</h2>
      {error && <p className="text-sm text-danger">{getErrorMessage(error)}</p>}
      {isLoading ? (
        <p className="text-muted">Loading…</p>
      ) : bids.length === 0 ? (
        <p className="text-muted">You haven't placed any bids yet.</p>
      ) : (
        bids.map((bid: Bid) => (
          <Card className="mb-3.5" key={bid.id}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="mb-1.5 text-[18px]">
                <Link to={`/jobs/${bid.job!.id}`}>{bid.job!.title}</Link>
              </h3>
              <Badge variant={bid.status === 'ACCEPTED' ? 'open' : 'neutral'}>{bid.status}</Badge>
            </div>
            <p className="text-muted">{bid.coverLetter}</p>
            <div className="flex items-center justify-between gap-3">
              <span>
                Your offer: ${bid.amount} · Spent {bid.connectsSpent} connects
              </span>
              {contractInfo(bid)}
            </div>
          </Card>
        ))
      )}
    </>
  );
}
