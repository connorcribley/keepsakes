'use client';

import { Star, StarHalf} from 'lucide-react';

interface StarRatingProps {
  rating: number; // e.g. 4.5
  max?: number;   // default to 5
}

const StarRating = ({ rating, max = 5 }: StarRatingProps) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: max }).map((_, i) => {
        const starNumber = i + 1;
        if (rating >= starNumber) {
          return <Star key={i} size={30} className="text-yellow-400 fill-yellow-400" />;
        } else if (rating > i && rating < starNumber) {
          return <StarHalf key={i} size={30} className="text-yellow-400 fill-yellow-400" />;
        } else {
          return <Star key={i} size={30} className="invisible" />;
        }
      })}
    </div>
  );
};

export default StarRating;
