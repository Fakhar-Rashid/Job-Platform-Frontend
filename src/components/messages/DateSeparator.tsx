interface DateSeparatorProps {
  label: string;
}

export default function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-hair" />
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="h-px flex-1 bg-hair" />
    </div>
  );
}
