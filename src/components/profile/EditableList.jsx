import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import SectionCard from './SectionCard.jsx';
import Modal from './Modal.jsx';
import ItemForm from './ItemForm.jsx';
import Button from '../ui/Button.jsx';
import { useChildMutations } from '../../hooks/queries/useProfile.js';
import { getErrorMessage } from '../../api/client.js';

export default function EditableList({
  title, subtitle, path, items, fields, renderItem, emptyText, editable,
}) {
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');
  const { create, update, remove } = useChildMutations(path);
  const busy = create.isPending || update.isPending;

  function startAdd() {
    setError('');
    setOpen({ mode: 'add', item: null });
  }

  function startEdit(item) {
    setError('');
    setOpen({ mode: 'edit', item });
  }

  async function submit(values) {
    setError('');
    try {
      if (open.mode === 'add') await create.mutateAsync(values);
      else await update.mutateAsync({ id: open.item.id, data: values });
      setOpen(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <SectionCard title={title} subtitle={subtitle} editable={editable} onAdd={startAdd}>
      {items.length === 0 ? (
        <p className="text-muted">{emptyText}</p>
      ) : (
        items.map((item) => (
          <div className="flex justify-between gap-3 border-t border-hair py-3 first:border-t-0 first:pt-0" key={item.id}>
            <div>{renderItem(item)}</div>
            {editable && (
              <div className="flex shrink-0 gap-0.5">
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)} aria-label="Edit"><Pencil size={15} /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(item.id)} aria-label="Delete"><Trash2 size={15} /></Button>
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
