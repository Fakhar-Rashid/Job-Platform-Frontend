import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Sun, Settings, LogOut } from 'lucide-react';
import Popover from '../ui/Popover';
import Switch from '../ui/Switch';
import { useAuth } from '../../hooks/useAuth';
import { useSwitchRole } from '../../hooks/useSwitchRole';
import * as profileApi from '../../api/profile';
import { avatarFor } from '../../utils/avatar';

const ROLE_LABEL = { FREELANCER: 'Freelancer', CLIENT: 'Client' } as const;

function MenuRow({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-soft hover:no-underline">
      {icon}
      {label}
    </Link>
  );
}

export default function AccountMenu() {
  const { user, logout, refreshUser } = useAuth();
  const { otherRole, switchRole, switching } = useSwitchRole();
  const navigate = useNavigate();

  if (!user) return null;

  async function toggleOnline(next: boolean) {
    await profileApi.updateCore({ onlineForMessages: next });
    await refreshUser();
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <Popover
      placement="right-start"
      trigger={<img className="h-8.5 w-8.5 rounded-full border border-line object-cover" src={avatarFor(user, 80)} alt="" />}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <img className="h-10 w-10 rounded-full object-cover" src={avatarFor(user, 80)} alt="" />
        <div className="min-w-0">
          <div className="truncate font-semibold">{user.name}</div>
          <div className="text-xs text-muted">{ROLE_LABEL[user.activeRole]}</div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-3">
        <span className="text-sm">Online for messages</span>
        <Switch checked={user.onlineForMessages} onChange={toggleOnline} label="Online for messages" />
      </div>

      <div className="border-t border-hair py-1.5">
        <MenuRow to="/profile" icon={<User size={17} />} label="My profile" />
        <MenuRow to="/settings" icon={<CreditCard size={17} />} label="Account" />
        <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted" aria-disabled>
          <Sun size={17} /> Theme: Light
        </div>
        <MenuRow to="/settings" icon={<Settings size={17} />} label="Settings" />
      </div>

      <div className="border-t border-hair py-1.5">
        <div className="px-4 py-1 text-xs text-muted">Switch accounts</div>
        <button
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left hover:bg-soft disabled:opacity-60"
          onClick={switchRole}
          disabled={switching}
        >
          <img className="h-9 w-9 rounded-full object-cover" src={avatarFor(user, 80)} alt="" />
          <div>
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="text-xs text-muted">{switching ? 'Switching…' : ROLE_LABEL[otherRole]}</div>
          </div>
        </button>
      </div>

      <div className="border-t border-hair pt-1.5">
        <button
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-soft"
          onClick={handleLogout}
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </Popover>
  );
}
