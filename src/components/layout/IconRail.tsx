import { Link, useLocation } from 'react-router-dom';
import {
  Search, Home, Bell, TrendingUp, Briefcase,
  CircleDollarSign, MessageSquare, Settings, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { avatarFor } from '../../utils/avatar';

const NAV = [
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/', icon: Home, label: 'Home' },
  { to: '/notifications', icon: Bell, label: 'Alerts' },
  { to: '/stats', icon: TrendingUp, label: 'Stats' },
  { to: '/my-jobs', icon: Briefcase, label: 'My jobs' },
  { to: '/my-bids', icon: CircleDollarSign, label: 'My bids' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/profile', icon: Settings, label: 'Settings' },
];

export default function IconRail() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="sticky top-0 flex h-screen w-16.5 shrink-0 flex-col items-center gap-2.5 self-start border-r border-hair bg-white py-3.5">
      <div className="flex flex-col items-center gap-3.5">
        <Link to="/" className="grid h-8.5 w-8.5 place-items-center rounded-full bg-brand text-[15px] font-bold text-white" aria-label="Home">up</Link>
        <Link to={user ? '/profile' : '/login'} aria-label="Profile">
          <img className="h-8.5 w-8.5 rounded-full border border-line object-cover" src={avatarFor(user, 80)} alt="" />
        </Link>
      </div>

      <nav className="mt-2 flex flex-1 flex-col items-center gap-1.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={label}
            to={to}
            className={`grid h-10.5 w-10.5 place-items-center rounded-[10px] hover:bg-brand-soft hover:text-ink hover:no-underline ${pathname === to ? 'bg-brand-soft text-ink' : 'text-muted'}`}
            aria-label={label}
            title={label}
          >
            <Icon size={22} strokeWidth={1.8} />
          </Link>
        ))}
      </nav>

      <Link to="/help" className="mt-auto grid h-10.5 w-10.5 place-items-center rounded-[10px] text-muted hover:bg-brand-soft hover:text-ink hover:no-underline" aria-label="Help" title="Help">
        <HelpCircle size={22} strokeWidth={1.8} />
      </Link>
    </aside>
  );
}
