import { useState } from 'react';
import { ChevronUp, ChevronDown, Info, Pencil } from 'lucide-react';

function ToggleRow({ label, value, onEdit }) {
  return (
    <div className="side-row">
      <div>
        <div className="label">{label} <Info size={14} className="muted" /></div>
        <div className="sub">{value ? 'On' : 'Off'}</div>
      </div>
      <button className="toggle-pencil" aria-label={`Edit ${label}`} onClick={onEdit}>
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
    <div className="side-card">
      <h4>
        Reach more clients
        <button className="toggle-pencil" aria-label="Toggle section" onClick={() => setOpen((o) => !o)}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </h4>
      {open && (
        <>
          <ToggleRow label="Availability badge" value={availability} onEdit={() => setAvailability((v) => !v)} />
          <ToggleRow label="Boost your profile" value={boost} onEdit={() => setBoost((v) => !v)} />
        </>
      )}
    </div>
  );
}
