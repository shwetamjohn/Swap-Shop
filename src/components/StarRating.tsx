import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  total?: number;
  size?: number;
  showCount?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, total, size = 12, showCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= fullStars ? 'fill-yellow-400 text-yellow-400' : 
              (star === fullStars + 1 && hasHalfStar) ? 'fill-yellow-400/50 text-yellow-400' : 
              'text-gray-200'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {rating.toFixed(1)} {total !== undefined && `(${total})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
