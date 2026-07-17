import type { ButtonHTMLAttributes } from 'react';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'border border-brand text-brand hover:bg-brand-soft',
  secondary: 'bg-chip text-ink hover:bg-hair',
  ghost: 'text-muted hover:bg-chip hover:text-ink',
};

const SIZES = {
  md: 'px-4 py-2',
  sm: 'px-3 py-1.5 text-sm',
  icon: 'p-1.5',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'md' | 'sm' | 'icon';
}

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
