import { Link, useLocation } from 'react-router-dom';
import { Home, CircleDollarSign, Briefcase, Users, Settings, HelpCircle, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { avatarFor } from '../../utils/avatar';
import AccountMenu from './AccountMenu';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const FREELANCER_NAV: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/my-bids', icon: CircleDollarSign, label: 'My proposals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const CLIENT_NAV: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/my-jobs', icon: Briefcase, label: 'My jobs' },
  { to: '/talent', icon: Users, label: 'Find talent' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function IconRail() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const nav = user?.activeRole === 'CLIENT' ? CLIENT_NAV : FREELANCER_NAV;

  return (
    <aside className="sticky top-0 flex h-screen w-16.5 shrink-0 flex-col items-center gap-2.5 self-start border-r border-hair bg-white py-3.5">
      <div className="flex flex-col items-center gap-3.5">
        <Link
          to="/"
          className="grid h-8.5 w-8.5 place-items-center rounded-full bg-brand text-[15px] font-bold text-white"
          aria-label="Home"
        >
          mw
        </Link>
        {user ? (
          <AccountMenu />
        ) : (
          <Link to="/login" aria-label="Log in">
            <img
              className="h-8.5 w-8.5 rounded-full border border-line object-cover"
              src={avatarFor(null, 80)}
              alt=""
            />
          </Link>
        )}
      </div>

      <nav className="mt-2 flex flex-1 flex-col items-center gap-1.5">
        {nav.map(({ to, icon: Icon, label }) => (
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

      <Link
        to="/help"
        className="mt-auto grid h-10.5 w-10.5 place-items-center rounded-[10px] text-muted hover:bg-brand-soft hover:text-ink hover:no-underline"
        aria-label="Help"
        title="Help"
      >
        <HelpCircle size={22} strokeWidth={1.8} />
      </Link>
    </aside>
  );
}
