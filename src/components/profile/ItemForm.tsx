import { useState } from 'react';
import Button from '../ui/Button';

export interface Field {
  name: string;
  label: string;
  type?: string;
  options?: [string, string][];
  rows?: number;
}

interface ItemFormProps {
  fields: Field[];
  initial?: Record<string, any> | null;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
  error?: string;
  busy?: boolean;
}

function initialValues(fields: Field[], initial?: Record<string, any> | null): Record<string, any> {
  const values: Record<string, any> = {};
  for (const field of fields) {
    const existing = initial?.[field.name];
    values[field.name] = existing ?? (field.type === 'checkbox' ? false : '');
  }
  return values;
}

interface FieldProps {
  field: Field;
  value: any;
  onChange: (name: string, value: any) => void;
}

function Field({ field, value, onChange }: FieldProps) {
  const common = {
    name: field.name,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(field.name, e.target.value),
  };
  const labelClass = 'flex flex-col gap-1.5 text-sm font-medium';

  if (field.type === 'textarea') {
    return (
      <label className={labelClass}>
        {field.label}
        <textarea rows={field.rows ?? 4} {...common} />
      </label>
    );
  }
  if (field.type === 'select') {
    return (
      <label className={labelClass}>
        {field.label}
        <select {...common}>
          <option value="">Select…</option>
          {field.options!.map(([val, text]) => (
            <option key={val} value={val}>
              {text}
            </option>
          ))}
        </select>
      </label>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="flex flex-row items-center gap-3 text-sm font-medium">
        <input type="checkbox" checked={value} onChange={(e) => onChange(field.name, e.target.checked)} />
        {field.label}
      </label>
    );
  }
  return (
    <label className={labelClass}>
      {field.label}
      <input type={field.type ?? 'text'} {...common} />
    </label>
  );
}

export default function ItemForm({ fields, initial, onSubmit, onCancel, error, busy }: ItemFormProps) {
  const [values, setValues] = useState<Record<string, any>>(() => initialValues(fields, initial));
  const update = (name: string, value: any) => setValues((prev) => ({ ...prev, [name]: value }));

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="flex flex-col gap-3.5" onSubmit={submit}>
      {fields.map((field) => (
        <Field key={field.name} field={field} value={values[field.name]} onChange={update} />
      ))}
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
