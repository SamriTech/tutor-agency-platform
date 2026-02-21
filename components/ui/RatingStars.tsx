
import React from 'react';
import StarIcon from '../icons/StarIcon';

interface RatingStarsProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalStars = 5, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <StarIcon
            key={index}
            className={`w-5 h-5 ${starValue <= rating ? 'text-amber-400' : 'text-neutral-300'}`}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
