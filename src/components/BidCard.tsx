import Card from './ui/Card';
import Badge from './ui/Badge';
import type { Bid } from '../types';

interface BidCardProps {
  bid: Bid;
  action?: React.ReactNode;
}

export default function BidCard({ bid, action }: BidCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <strong>{bid.freelancer?.name ?? 'Freelancer'}</strong>
        <Badge variant={bid.status === 'ACCEPTED' ? 'open' : 'neutral'}>{bid.status}</Badge>
      </div>
      <p className="text-muted">{bid.coverLetter}</p>
      <div className="flex items-center justify-between gap-3">
        <span>Offer: ${bid.amount}</span>
        {action}
      </div>
    </Card>
  );
}
