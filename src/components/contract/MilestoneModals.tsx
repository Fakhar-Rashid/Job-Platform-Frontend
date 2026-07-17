import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import Button from '../ui/Button';
import Modal from '../profile/Modal';
import { getErrorMessage } from '../../api/client';

export function ErrorNote({ err }: { err: unknown }) {
  if (err == null) return null;
  const needsFunds = isAxiosError(err) && err.response?.status === 402;
  return (
    <p className="text-danger text-sm">
      {getErrorMessage(err)}{' '}
      {needsFunds && (
        <Link to="/settings" className="font-semibold text-danger underline">
          Add funds
        </Link>
      )}
    </p>
  );
}

interface MilestoneFormModalProps {
  title: string;
  initial?: { description: string; amount: number };
  pending: boolean;
  onClose: () => void;
  onSave: (data: { description: string; amount: number }) => Promise<void>;
}

export function MilestoneFormModal({ title, initial, pending, onClose, onSave }: MilestoneFormModalProps) {
  const [description, setDescription] = useState(initial?.description ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await onSave({ description, amount: Number(amount) });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Amount ($)
          <input type="number" min={1} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        {error && <p className="text-danger text-sm">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Modal>
  );
}

interface NoteModalProps {
  title: string;
  label: string;
  cta: string;
  pending: boolean;
  onClose: () => void;
  onSave: (text: string) => Promise<void>;
}

export function NoteModal({ title, label, cta, pending, onClose, onSave }: NoteModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await onSave(text);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {label}
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} required />
        </label>
        {error && <p className="text-danger text-sm">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending…' : cta}
        </Button>
      </form>
    </Modal>
  );
}
