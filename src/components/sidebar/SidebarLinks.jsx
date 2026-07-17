import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import * as connectsApi from '../../api/connects.js';

const NAV = [
  { label: 'Preferences', to: '/profile' },
  { label: 'Proposals', to: '/my-bids' },
  { label: 'Project Catalog', to: '/' },
];

export default function SidebarLinks() {
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
    <nav className="side-nav">
      <div className="side-nav-connects">
        <Link to="/profile">Connects: {user.connectBalance}</Link>
        <button className="link-green" onClick={handleTopUp} disabled={busy}>
          {busy ? 'Adding…' : 'Buy Connects'}
        </button>
      </div>
      {NAV.map(({ label, to }) => (
        <Link key={label} to={to}>{label}</Link>
      ))}
    </nav>
  );
}
