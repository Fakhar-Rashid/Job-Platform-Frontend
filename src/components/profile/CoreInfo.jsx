import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import * as profileApi from '../../api/profile.js';
import { getErrorMessage } from '../../api/client.js';

export default function CoreInfo({ profile, editable, onChanged }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg">{profile.title || 'Add your professional title'}</h3>
        <div className="flex items-center gap-3">
          {profile.hourlyRate != null && <span className="whitespace-nowrap font-semibold">${profile.hourlyRate}.00/hr</span>}
          {editable && (
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setOpen(true)} aria-label="Edit title">
              <Pencil size={15} />
            </Button>
          )}
        </div>
      </div>
      {profile.overview
        ? <p className="whitespace-pre-wrap">{profile.overview}</p>
        : <p className="text-muted">Add an overview describing what you do.</p>}

      {open && (
        <Modal title="Edit profile summary" onClose={() => setOpen(false)}>
          <ItemForm
            fields={[
              { name: 'title', label: 'Professional title' },
              { name: 'hourlyRate', label: 'Hourly rate (USD)', type: 'number' },
              { name: 'overview', label: 'Overview', type: 'textarea', rows: 6 },
            ]}
            initial={{ title: profile.title, hourlyRate: profile.hourlyRate, overview: profile.overview }}
            onSubmit={submit}
            onCancel={() => setOpen(false)}
            error={error}
            busy={busy}
          />
        </Modal>
      )}
    </Card>
  );
}
