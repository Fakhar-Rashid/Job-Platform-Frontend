import { useState } from 'react';
import SectionCard from './SectionCard.jsx';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import * as profileApi from '../../api/profile.js';
import { getErrorMessage } from '../../api/client.js';

export default function CoreSection({ title, subtitle, fields, values, editable, onChanged, children }) {
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
    <SectionCard title={title} subtitle={subtitle} editable={editable} onEdit={() => setOpen(true)}>
      {children}
      {open && (
        <Modal title={`Edit ${title}`} onClose={() => setOpen(false)}>
          <ItemForm fields={fields} initial={values} onSubmit={submit} onCancel={() => setOpen(false)} error={error} busy={busy} />
        </Modal>
      )}
    </SectionCard>
  );
}
