import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { avatarFor } from '../../utils/avatar';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card>
        <h4 className="mb-4 flex items-center justify-between text-base">Join MiniWork</h4>
        <p className="text-muted">Sign up to bid on jobs and hire freelancers.</p>
        <Link to="/register">
          <Button className="w-full">Create account</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <img src={avatarFor(user, 104)} alt="" className="h-13 w-13 rounded-full object-cover" />
        <div>
          <Link to="/profile" className="font-semibold underline">
            {user.name}
          </Link>
          <div className="text-[13px] text-muted">{user.title || 'Add your professional title'}</div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-hair py-3 text-sm">
        <span className="flex items-center gap-1.5">Profile Visibility</span>
        <span className="font-medium text-brand">Public</span>
      </div>

      <div className="pt-3">
        <Link to="/profile" className="font-medium text-brand">
          Complete your profile
        </Link>
        <div className="mt-1.5 flex items-center gap-2.5">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hair">
            <div className="h-full w-full bg-brand" />
          </div>
          <span className="text-muted">100%</span>
        </div>
      </div>
    </Card>
  );
}
