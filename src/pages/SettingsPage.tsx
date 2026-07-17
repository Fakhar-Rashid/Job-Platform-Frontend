import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import Modal from '../components/profile/Modal';
import ItemForm from '../components/profile/ItemForm';
import { useAuth } from '../hooks/useAuth';
import * as profileApi from '../api/profile';
import * as connectsApi from '../api/connects';
import { getErrorMessage } from '../api/client';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function save(values: Record<string, any>) {
    setBusy(true);
    setError('');
    try {
      await profileApi.updateCore(values);
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function toggleOnline(next: boolean) {
    await profileApi.updateCore({ onlineForMessages: next });
    await refreshUser();
  }

  async function buyConnects() {
    setBusy(true);
    try {
      await connectsApi.topUp();
      await refreshUser();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h2 className="text-2xl">Settings</h2>

      <Card>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3>Account</h3>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setEditing(true)} aria-label="Edit account">
            <Pencil size={15} />
          </Button>
        </div>
        <div className="flex items-center justify-between border-t border-hair py-2.5 text-sm">
          <span className="text-muted">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="flex items-center justify-between border-t border-hair py-2.5 text-sm">
          <span className="text-muted">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="flex items-center justify-between border-t border-hair py-2.5 text-sm">
          <span className="text-muted">Online for messages</span>
          <Switch checked={user.onlineForMessages} onChange={toggleOnline} label="Online for messages" />
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3>Connects: {user.connectBalance}</h3>
        </div>
        <Button variant="outline" onClick={buyConnects} disabled={busy}>
          {busy ? 'Adding…' : 'Buy Connects'}
        </Button>
      </Card>

      {editing && (
        <Modal title="Edit account" onClose={() => setEditing(false)}>
          <ItemForm
            fields={[
              { name: 'name', label: 'Name' },
              { name: 'avatarUrl', label: 'Avatar URL' },
              { name: 'city', label: 'City' },
              { name: 'country', label: 'Country' },
            ]}
            initial={{ name: user.name, avatarUrl: user.avatarUrl }}
            onSubmit={save}
            onCancel={() => setEditing(false)}
            error={error}
            busy={busy}
          />
        </Modal>
      )}
    </div>
  );
}
