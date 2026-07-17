import { useEffect, useRef, useState, type ReactNode } from 'react';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  placement?: 'right-start' | 'bottom-start';
  className?: string;
}

const PLACEMENTS: Record<NonNullable<PopoverProps['placement']>, string> = {
  'right-start': 'left-full top-0 ml-2',
  'bottom-start': 'top-full left-0 mt-2',
};

export default function Popover({ trigger, children, placement = 'right-start', className = '' }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  function show() {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function hide() {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div ref={rootRef} className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button className="block cursor-pointer" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute z-50 w-72 rounded-2xl border border-hair bg-white py-2 shadow-xl ${PLACEMENTS[placement]} ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
