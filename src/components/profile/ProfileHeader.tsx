import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, Share2 } from 'lucide-react';
import Modal from './Modal';
import ItemForm from './ItemForm';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useUpdateCore } from '../../hooks/queries/useProfile';
import { getErrorMessage } from '../../api/client';
import { avatarFor } from '../../utils/avatar';
import type { Profile } from '../../types';

interface ProfileHeaderProps {
  profile: Profile;
  editable: boolean;
}

export default function ProfileHeader({ profile, editable }: ProfileHeaderProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const updateCore = useUpdateCore();
  const location = [profile.city, profile.country].filter(Boolean).join(', ');

  async function submit(next: Record<string, any>) {
    setError('');
    try {
      await updateCore.mutateAsync(next);
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img className="h-20 w-20 rounded-full object-cover" src={avatarFor(profile)} alt="" />
        <div>
          <h2 className="flex items-center gap-2">
            {profile.name}
            {profile.idVerified && <BadgeCheck size={20} className="text-verified" />}
          </h2>
          <p className="flex items-center gap-1.5 text-muted">
            <MapPin size={15} /> {location || 'Location not set'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {editable && (
          <>
            <Link to={`/users/${profile.id}`}><Button variant="outline">See public view</Button></Link>
            <Button onClick={() => setOpen(true)}>Profile settings</Button>
          </>
        )}
        <Button variant="ghost" className="gap-1.5"><Share2 size={16} /> Share</Button>
      </div>

      {open && (
        <Modal title="Profile settings" onClose={() => setOpen(false)}>
          <ItemForm
            fields={[
              { name: 'name', label: 'Name' },
              { name: 'city', label: 'City' },
              { name: 'country', label: 'Country' },
              { name: 'avatarUrl', label: 'Avatar URL' },
            ]}
            initial={{ name: profile.name, city: profile.city, country: profile.country, avatarUrl: profile.avatarUrl }}
            onSubmit={submit}
            onCancel={() => setOpen(false)}
            error={error}
            busy={updateCore.isPending}
          />
        </Modal>
      )}
    </Card>
  );
}
