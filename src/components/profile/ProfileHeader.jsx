import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, Share2 } from 'lucide-react';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import * as profileApi from '../../api/profile.js';
import { getErrorMessage } from '../../api/client.js';
import { avatarFor } from '../../utils/avatar.js';

export default function ProfileHeader({ profile, editable, onChanged }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const location = [profile.city, profile.country].filter(Boolean).join(', ');

  async function submit(next) {
    setBusy(true);
    setError('');
    try {
      await profileApi.updateCore(next);
      setOpen(false);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card profile-header">
      <div className="profile-header-main">
        <img className="profile-avatar" src={avatarFor(profile)} alt="" />
        <div>
          <h2 className="row" style={{ gap: 8 }}>
            {profile.name}
            {profile.idVerified && <BadgeCheck size={20} className="verified" />}
          </h2>
          <p className="muted row" style={{ gap: 6 }}>
            <MapPin size={15} /> {location || 'Location not set'}
          </p>
        </div>
      </div>

      <div className="profile-header-actions">
        {editable && (
          <>
            <Link to={`/users/${profile.id}`}><button className="outline">See public view</button></Link>
            <button onClick={() => setOpen(true)}>Profile settings</button>
          </>
        )}
        <button className="ghost row" style={{ gap: 6 }}><Share2 size={16} /> Share</button>
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
            busy={busy}
          />
        </Modal>
      )}
    </section>
  );
}
