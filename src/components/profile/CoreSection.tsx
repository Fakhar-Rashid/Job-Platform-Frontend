import { useState } from 'react';
import SectionCard from './SectionCard';
import Modal from './Modal';
import ItemForm, { Field } from './ItemForm';
import { useUpdateCore } from '../../hooks/queries/useProfile';
import { getErrorMessage } from '../../api/client';

interface CoreSectionProps {
  title: string;
  subtitle?: string;
  fields: Field[];
  values: Record<string, any>;
  editable: boolean;
  children?: React.ReactNode;
}

export default function CoreSection({
  title,
  subtitle,
  fields,
  values,
  editable,
  children,
}: CoreSectionProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const updateCore = useUpdateCore();

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
    <SectionCard title={title} subtitle={subtitle} editable={editable} onEdit={() => setOpen(true)}>
      {children}
      {open && (
        <Modal title={`Edit ${title}`} onClose={() => setOpen(false)}>
          <ItemForm
            fields={fields}
            initial={values}
            onSubmit={submit}
            onCancel={() => setOpen(false)}
            error={error}
            busy={updateCore.isPending}
          />
        </Modal>
      )}
    </SectionCard>
  );
}
