import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useProfile } from '../hooks/queries/useProfile.js';
import ProfileView from '../components/profile/ProfileView.jsx';
import { getErrorMessage } from '../api/client.js';

export default function ProfilePage() {
  const { id: paramId } = useParams();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  const editable = !paramId || paramId === user?.id;
  const { data: profile, error, isLoading } = useProfile(id);

  if (error) return <p className="text-danger text-sm">{getErrorMessage(error)}</p>;
  if (isLoading || !profile) return <p className="text-muted">Loading…</p>;

  return <ProfileView profile={profile} editable={editable} />;
}
