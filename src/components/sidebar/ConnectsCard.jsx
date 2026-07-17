import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import * as connectsApi from '../../api/connects.js';

export default function ConnectsCard() {
  const { user, refreshUser } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function handleTopUp() {
    setBusy(true);
    try {
      await connectsApi.topUp();
      await refreshUser();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="side-card">
      <h4>Connects: {user.connectBalance}</h4>
      <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>
        Spend connects to bid on jobs. Each proposal costs 5.
      </p>
      <button className="outline" style={{ width: '100%' }} onClick={handleTopUp} disabled={busy}>
        {busy ? 'Adding…' : 'Buy Connects'}
      </button>
    </div>
  );
}
