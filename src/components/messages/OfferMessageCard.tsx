import { Link } from 'react-router-dom';
import type { MessageOffer } from '../../types';

interface OfferMessageCardProps {
  offer: MessageOffer;
  body: string;
}

export default function OfferMessageCard({ offer, body }: OfferMessageCardProps) {
  return (
    <div className="mt-1 rounded-lg border border-hair bg-soft p-4">
      <p className="text-muted">{body}</p>
      <div className="mt-3 space-y-1 font-semibold text-ink">
        {offer.type === 'FIXED' ? (
          <>
            <p>Est. Budget: ${offer.total}.00</p>
            <p>Milestone 1: {offer.firstMilestone}</p>
            <p>Project funds: ${offer.total}.00</p>
          </>
        ) : (
          <p>Hourly rate: ${offer.hourlyRate}.00/hr</p>
        )}
      </div>
      <Link
        to={`/contracts/${offer.contractId}`}
        className="mt-3 inline-block font-semibold text-brand hover:text-brand-dark"
      >
        View offer
      </Link>
    </div>
  );
}
