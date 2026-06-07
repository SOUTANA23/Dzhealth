import { Star } from 'lucide-react';

type RatingBarProps = {
  star: number;
  percentage: number;
};

export function RatingBar({ star, percentage }: RatingBarProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400 w-3 text-right">{star}</span>
      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-gray-400 w-6 text-left text-xs">{percentage}%</span>
    </div>
  );
}

type StarRatingProps = {
  rating: number;
  size?: 'sm' | 'md';
};

export function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={`${sz} ${s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ))}
    </div>
  );
}
