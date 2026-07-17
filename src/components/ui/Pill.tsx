import type { HTMLAttributes } from 'react';

type PillProps = HTMLAttributes<HTMLSpanElement>;

export default function Pill({ className = '', children, ...props }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-chip px-3.5 py-1.5 text-[13px] font-medium text-ink ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
