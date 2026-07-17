export default function Card({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag className={`rounded-xl border border-hair bg-white p-5 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
