import type { ElementType, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export default function Card({ as: Tag = 'section', className = '', children, ...props }: CardProps) {
  return (
    <Tag className={`rounded-xl border border-hair bg-white p-5 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
