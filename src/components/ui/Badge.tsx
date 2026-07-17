import type { ReactNode } from 'react';

const VARIANTS = {
  neutral: 'bg-chip text-muted',
  open: 'bg-[#e4f7e4] text-[#14751a]',
  closed: 'bg-[#fdeaea] text-[#a12020]',
};

interface BadgeProps {
  variant?: 'neutral' | 'open' | 'closed';
  className?: string;
  children?: ReactNode;
}

export default function Badge({ variant = 'neutral', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
