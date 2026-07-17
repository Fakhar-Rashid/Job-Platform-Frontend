import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as bidsApi from '../api/bids.js';
import { getErrorMessage } from '../api/client.js';

export default function MyBidsPage() {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    bidsApi.myBids().then(setBids).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <>
      <h2>My bids</h2>
      {error && <p className="error">{error}</p>}
      {bids.length === 0 ? (
        <p className="muted">You haven't placed any bids yet.</p>
      ) : (
        bids.map((bid) => (
          <div className="card" key={bid.id}>
            <div className="row between">
              <h3><Link to={`/jobs/${bid.job.id}`}>{bid.job.title}</Link></h3>
              <span className={`badge ${bid.status === 'ACCEPTED' ? 'open' : ''}`}>{bid.status}</span>
            </div>
            <p className="muted">{bid.coverLetter}</p>
            <span>Your offer: ${bid.amount} · Spent {bid.connectsSpent} connects</span>
          </div>
        ))
      )}
    </>
  );
}
