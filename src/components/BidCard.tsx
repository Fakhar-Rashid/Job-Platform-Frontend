import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import type { Bid } from '../types';

interface BidCardProps {
  bid: Bid;
  onAccept: (id: string) => void;
  canAccept: boolean;
}

export default function BidCard({ bid, onAccept, canAccept }: BidCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <strong>{bid.freelancer?.name ?? 'Freelancer'}</strong>
        <Badge variant={bid.status === 'ACCEPTED' ? 'open' : 'neutral'}>{bid.status}</Badge>
      </div>
      <p className="text-muted">{bid.coverLetter}</p>
      <div className="flex items-center justify-between gap-3">
        <span>Offer: ${bid.amount}</span>
        {canAccept && bid.status === 'PENDING' && (
          <Button onClick={() => onAccept(bid.id)}>Accept</Button>
        )}
      </div>
    </Card>
  );
}
