export default function Pill({ className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-chip px-3.5 py-1.5 text-[13px] font-medium text-ink ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
