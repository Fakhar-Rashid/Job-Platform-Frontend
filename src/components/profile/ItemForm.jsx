import { useState } from 'react';
import Button from '../ui/Button.jsx';

function initialValues(fields, initial) {
  const values = {};
  for (const field of fields) {
    const existing = initial?.[field.name];
    values[field.name] = existing ?? (field.type === 'checkbox' ? false : '');
  }
  return values;
}

function Field({ field, value, onChange }) {
  const common = { name: field.name, value, onChange: (e) => onChange(field.name, e.target.value) };
  const labelClass = 'flex flex-col gap-1.5 text-sm font-medium';

  if (field.type === 'textarea') {
    return <label className={labelClass}>{field.label}<textarea rows={field.rows ?? 4} {...common} /></label>;
  }
  if (field.type === 'select') {
    return (
      <label className={labelClass}>{field.label}
        <select {...common}>
          <option value="">Select…</option>
          {field.options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
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
  return <label className={labelClass}>{field.label}<input type={field.type ?? 'text'} {...common} /></label>;
}

export default function ItemForm({ fields, initial, onSubmit, onCancel, error, busy }) {
  const [values, setValues] = useState(() => initialValues(fields, initial));
  const update = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  function submit(event) {
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
        <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
