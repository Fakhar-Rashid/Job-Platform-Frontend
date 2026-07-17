import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import * as connectsApi from '../api/connects.js';
import { getErrorMessage } from '../api/client.js';

export default function ProfilePage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    connectsApi.transactions().then(setTransactions).catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <>
      <h2>{user.name}</h2>
      <p className="muted">{user.email}</p>
      <div className="card">
        <strong>{user.connectBalance} connects available</strong>
      </div>

      <h3>Connect history</h3>
      {error && <p className="error">{error}</p>}
      {transactions.length === 0 ? (
        <p className="muted">No transactions yet.</p>
      ) : (
        transactions.map((tx) => (
          <div className="card row between" key={tx.id}>
            <span>{tx.reason === 'TOPUP' ? 'Top up' : 'Bid placed'}</span>
            <span>{tx.amount > 0 ? `+${tx.amount}` : tx.amount} connects</span>
          </div>
        ))
      )}
    </>
  );
}
