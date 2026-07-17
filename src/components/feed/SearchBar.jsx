import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={20} strokeWidth={1.8} />
      <input
        placeholder="Search for jobs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
