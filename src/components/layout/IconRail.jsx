import { Link, useLocation } from 'react-router-dom';
import {
  Search, Home, Bell, TrendingUp, Briefcase,
  CircleDollarSign, MessageSquare, Settings, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { avatarFor } from '../../utils/avatar.js';

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
    <aside className="rail">
      <div className="rail-top">
        <Link to="/" className="up-logo" aria-label="Home">up</Link>
        <Link to={user ? '/profile' : '/login'} aria-label="Profile">
          <img className="rail-avatar" src={avatarFor(user, 80)} alt="" />
        </Link>
      </div>

      <nav className="rail-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link
            key={label}
            to={to}
            className={`rail-item ${pathname === to ? 'active' : ''}`}
            aria-label={label}
            title={label}
          >
            <Icon size={22} strokeWidth={1.8} />
          </Link>
        ))}
      </nav>

      <Link to="/help" className="rail-item rail-bottom" aria-label="Help" title="Help">
        <HelpCircle size={22} strokeWidth={1.8} />
      </Link>
    </aside>
  );
}
