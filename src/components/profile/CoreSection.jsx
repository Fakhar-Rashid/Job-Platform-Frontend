import { useState } from 'react';
import SectionCard from './SectionCard.jsx';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import { useUpdateCore } from '../../hooks/queries/useProfile.js';
import { getErrorMessage } from '../../api/client.js';

export default function CoreSection({ title, subtitle, fields, values, editable, children }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const updateCore = useUpdateCore();

  async function submit(next) {
    setError('');
    try {
      await updateCore.mutateAsync(next);
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <SectionCard title={title} subtitle={subtitle} editable={editable} onEdit={() => setOpen(true)}>
      {children}
      {open && (
        <Modal title={`Edit ${title}`} onClose={() => setOpen(false)}>
          <ItemForm fields={fields} initial={values} onSubmit={submit} onCancel={() => setOpen(false)} error={error} busy={updateCore.isPending} />
        </Modal>
      )}
    </SectionCard>
  );
}
