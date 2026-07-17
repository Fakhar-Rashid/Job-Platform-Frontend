import { useState } from 'react';

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

  if (field.type === 'textarea') {
    return <label>{field.label}<textarea rows={field.rows ?? 4} {...common} /></label>;
  }
  if (field.type === 'select') {
    return (
      <label>{field.label}
        <select {...common}>
          <option value="">Select…</option>
          {field.options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
        </select>
      </label>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="row" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <input type="checkbox" checked={value} onChange={(e) => onChange(field.name, e.target.checked)} />
        {field.label}
      </label>
    );
  }
  return <label>{field.label}<input type={field.type ?? 'text'} {...common} /></label>;
}

export default function ItemForm({ fields, initial, onSubmit, onCancel, error, busy }) {
  const [values, setValues] = useState(() => initialValues(fields, initial));
  const update = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  function submit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="stack" onSubmit={submit}>
      {fields.map((field) => (
        <Field key={field.name} field={field} value={values[field.name]} onChange={update} />
      ))}
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
