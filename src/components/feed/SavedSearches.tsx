interface SavedSearchesProps {
  onSelect: (term: string) => void;
}

const SAVED = ['Software engineer', 'quick', 'Modified', 'fix'];

export default function SavedSearches({ onSelect }: SavedSearchesProps) {
  return (
    <div className="mt-4.5 mb-6 text-sm text-ink">
      <b className="mr-1.5">Saved Searches:</b>
      {SAVED.map((term, index) => (
        <span key={term}>
          <button className="cursor-pointer font-medium text-brand hover:underline" onClick={() => onSelect(term)}>{term}</button>
          {index < SAVED.length - 1 && <span>, </span>}
        </span>
      ))}
    </div>
  );
}
