import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as connectsApi from '../../api/connects';

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
    <nav className="flex flex-col gap-3.5 px-5 py-1">
      <div className="flex flex-col gap-0.5">
        <Link to="/profile" className="font-semibold">Connects: {user.connectBalance}</Link>
        <button
          className="self-start p-0 text-[13px] font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-55"
          onClick={handleTopUp}
          disabled={busy}
        >
          {busy ? 'Adding…' : 'Buy Connects'}
        </button>
      </div>
      {NAV.map(({ label, to }) => (
        <Link key={label} to={to} className="font-medium">{label}</Link>
      ))}
    </nav>
  );
}
