import { SlidersHorizontal } from 'lucide-react';

const TABS = ['Best matches', 'Most recent', 'My feed', 'Saved jobs', 'Invites'];

export default function FeedTabs({ active, onSelect, onToggleFilters }) {
  return (
    <div className="feed-head">
      <div className="feed-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={active === tab ? 'active' : ''}
            onClick={() => onSelect(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <button className="outline" onClick={onToggleFilters}>
        <span className="row" style={{ gap: 6 }}>
          <SlidersHorizontal size={16} /> Filters
        </span>
      </button>
    </div>
  );
}
