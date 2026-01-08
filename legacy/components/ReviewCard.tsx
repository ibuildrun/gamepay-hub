
import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="glass-card p-6 border-white/5 hover:border-blue-500/20 transition-all group">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
           <img src={review.avatar} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5" alt={review.user} />
           <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#161a23] border border-white/5 rounded-full flex items-center justify-center">
              <Star size={10} fill="#fbbf24" className="text-yellow-500" />
           </div>
        </div>
        <div>
          <h4 className="font-bold text-sm text-blue-400 group-hover:text-blue-300 transition-colors">{review.user}</h4>
          <div className="flex items-center space-x-1">
             <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={10} fill="#fbbf24" className="text-yellow-500" />
                ))}
             </div>
             <span className="text-[10px] font-black text-white/50">{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className="text-[13px] text-gray-400 leading-relaxed italic line-clamp-2">"{review.text}"</p>
    </div>
  );
};

export default ReviewCard;
