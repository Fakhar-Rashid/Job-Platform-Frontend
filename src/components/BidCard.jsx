export default function BidCard({ bid, onAccept, canAccept }) {
  return (
    <div className="card">
      <div className="row between">
        <strong>{bid.freelancer?.name ?? 'Freelancer'}</strong>
        <span className={`badge ${bid.status === 'ACCEPTED' ? 'open' : ''}`}>{bid.status}</span>
      </div>
      <p className="muted">{bid.coverLetter}</p>
      <div className="row between">
        <span>Offer: ${bid.amount}</span>
        {canAccept && bid.status === 'PENDING' && (
          <button onClick={() => onAccept(bid.id)}>Accept</button>
        )}
      </div>
    </div>
  );
}
