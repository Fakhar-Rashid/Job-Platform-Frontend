import { Star } from 'lucide-react';

export default function Stars({ rating = 0, size = 15 }) {
  return (
    <span className="inline-flex text-star" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= Math.round(rating) ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}
