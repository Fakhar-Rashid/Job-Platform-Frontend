import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex h-13 items-center gap-3 rounded-full border border-line px-4.5 text-muted focus-within:border-brand">
      <Search size={20} strokeWidth={1.8} />
      <input
        className="flex-1 border-0 bg-transparent p-0 text-[15px] focus:outline-none"
        placeholder="Search for jobs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
