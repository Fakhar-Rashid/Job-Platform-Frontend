import { useState } from 'react';
import { ChevronUp, ChevronDown, Info, Pencil } from 'lucide-react';
import Card from '../ui/Card';

interface ToggleRowProps {
  label: string;
  value: boolean;
  onEdit: () => void;
}

function ToggleRow({ label, value, onEdit }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between border-t border-hair py-3 text-sm">
      <div>
        <div className="flex items-center gap-1.5">
          {label} <Info size={14} className="text-muted" />
        </div>
        <div className="text-xs text-muted">{value ? 'On' : 'Off'}</div>
      </div>
      <button
        className="rounded-md p-1 text-brand hover:bg-brand-soft"
        aria-label={`Edit ${label}`}
        onClick={onEdit}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
}

export default function ReachMoreClients() {
  const [open, setOpen] = useState(true);
  const [availability, setAvailability] = useState(false);
  const [boost, setBoost] = useState(true);

  return (
    <Card>
      <h4 className="mb-4 flex items-center justify-between text-base">
        Reach more clients
        <button
          className="rounded-md p-1 text-brand hover:bg-brand-soft"
          aria-label="Toggle section"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </h4>
      {open && (
        <>
          <ToggleRow
            label="Availability badge"
            value={availability}
            onEdit={() => setAvailability((v) => !v)}
          />
          <ToggleRow label="Boost your profile" value={boost} onEdit={() => setBoost((v) => !v)} />
        </>
      )}
    </Card>
  );
}
