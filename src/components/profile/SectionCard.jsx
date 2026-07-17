import { Plus, Pencil } from 'lucide-react';

export default function SectionCard({ title, subtitle, editable, onAdd, onEdit, children }) {
  return (
    <section className="card profile-section">
      <div className="section-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="muted section-sub">{subtitle}</p>}
        </div>
        {editable && (onAdd || onEdit) && (
          <div className="row" style={{ gap: 6 }}>
            {onEdit && (
              <button className="icon-round" onClick={onEdit} aria-label={`Edit ${title}`}>
                <Pencil size={15} />
              </button>
            )}
            {onAdd && (
              <button className="icon-round" onClick={onAdd} aria-label={`Add to ${title}`}>
                <Plus size={17} />
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
