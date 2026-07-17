import { SlidersHorizontal } from 'lucide-react';
import Button from '../ui/Button.jsx';

const TABS = ['Best matches', 'Most recent', 'My feed', 'Saved jobs', 'Invites'];

export default function FeedTabs({ active, onSelect, onToggleFilters }) {
  return (
    <div className="flex items-center justify-between border-b border-hair">
      <div className="flex gap-6.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`-mb-px cursor-pointer border-b-2 border-transparent pb-3.5 font-semibold hover:text-ink ${active === tab ? 'border-brand text-ink' : 'text-muted'}`}
            onClick={() => onSelect(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <Button variant="outline" onClick={onToggleFilters}>
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal size={16} /> Filters
        </span>
      </Button>
    </div>
  );
}
