import { Plus, Pencil } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';

export default function SectionCard({ title, subtitle, editable, onAdd, onEdit, children }) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
        </div>
        {editable && (onAdd || onEdit) && (
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={onEdit} aria-label={`Edit ${title}`}>
                <Pencil size={15} />
              </Button>
            )}
            {onAdd && (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={onAdd} aria-label={`Add to ${title}`}>
                <Plus size={17} />
              </Button>
            )}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}
