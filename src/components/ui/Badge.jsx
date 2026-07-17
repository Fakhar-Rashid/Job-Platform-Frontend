const VARIANTS = {
  neutral: 'bg-chip text-muted',
  open: 'bg-[#e4f7e4] text-[#14751a]',
  closed: 'bg-[#fdeaea] text-[#a12020]',
};

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}
