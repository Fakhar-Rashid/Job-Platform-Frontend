const SAVED = ['Software engineer', 'quick', 'Modified', 'fix'];

export default function SavedSearches({ onSelect }) {
  return (
    <div className="saved-searches">
      <b>Saved Searches:</b>
      {SAVED.map((term, index) => (
        <span key={term}>
          <button onClick={() => onSelect(term)}>{term}</button>
          {index < SAVED.length - 1 && <span>, </span>}
        </span>
      ))}
    </div>
  );
}
