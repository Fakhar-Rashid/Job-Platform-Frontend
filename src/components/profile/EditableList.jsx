import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import * as profileApi from '../../api/profile.js';
import { getErrorMessage } from '../../api/client.js';

export default function EditableList({
  title, subtitle, path, items, fields, renderItem, emptyText, editable, onChanged,
}) {
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function startAdd() {
    setError('');
    setOpen({ mode: 'add', item: null });
  }

  function startEdit(item) {
    setError('');
    setOpen({ mode: 'edit', item });
  }

  async function submit(values) {
    setBusy(true);
    setError('');
    try {
      if (open.mode === 'add') await profileApi.createChild(path, values);
      else await profileApi.updateChild(path, open.item.id, values);
      setOpen(null);
      onChanged();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    await profileApi.deleteChild(path, id);
    onChanged();
  }

  return (
    <SectionCard title={title} subtitle={subtitle} editable={editable} onAdd={startAdd}>
      {items.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        items.map((item) => (
          <div className="list-item" key={item.id}>
            <div className="list-item-body">{renderItem(item)}</div>
            {editable && (
              <div className="list-item-actions">
                <button className="ghost" onClick={() => startEdit(item)} aria-label="Edit"><Pencil size={15} /></button>
                <button className="ghost" onClick={() => remove(item.id)} aria-label="Delete"><Trash2 size={15} /></button>
              </div>
            )}
          </div>
        ))
      )}

      {open && (
        <Modal title={`${open.mode === 'add' ? 'Add' : 'Edit'} ${title}`} onClose={() => setOpen(null)}>
          <ItemForm
            fields={fields}
            initial={open.item}
            onSubmit={submit}
            onCancel={() => setOpen(null)}
            error={error}
            busy={busy}
          />
        </Modal>
      )}
    </SectionCard>
  );
}
