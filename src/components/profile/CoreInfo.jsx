import { useState } from 'react';
import { Pencil } from 'lucide-react';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
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
    <section className="card">
      <div className="section-head">
        <h3>{profile.title || 'Add your professional title'}</h3>
        <div className="row" style={{ gap: 12 }}>
          {profile.hourlyRate != null && <span className="rate">${profile.hourlyRate}.00/hr</span>}
          {editable && (
            <button className="icon-round" onClick={() => setOpen(true)} aria-label="Edit title">
              <Pencil size={15} />
            </button>
          )}
        </div>
      </div>
      {profile.overview
        ? <p className="overview">{profile.overview}</p>
        : <p className="muted">Add an overview describing what you do.</p>}

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
    </section>
  );
}
