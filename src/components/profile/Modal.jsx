import { X } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-5" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[460px] overflow-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3.5 flex items-center justify-between">
          <h3>{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close"><X size={20} /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}
