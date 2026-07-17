import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useProfile } from '../hooks/useProfile.js';
import ProfileView from '../components/profile/ProfileView.jsx';

export default function ProfilePage() {
  const { id: paramId } = useParams();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  const editable = !paramId || paramId === user?.id;
  const { profile, error, reload } = useProfile(id);

  if (error) return <p className="text-danger text-sm">{error}</p>;
  if (!profile) return <p className="text-muted">Loading…</p>;

  return <ProfileView profile={profile} editable={editable} onChanged={reload} />;
}
