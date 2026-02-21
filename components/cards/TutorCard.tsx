
import React from 'react';
import { Tutor, TutorStatus } from '../../types';
import CheckCircleIcon from '../icons/CheckCircleIcon';
import RatingStars from '../ui/RatingStars';
import { useNavigate } from 'react-router-dom';


interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative">
        <img className="w-full h-40 object-cover" src={tutor.avatarUrl} alt={tutor.name} />
        {tutor.status === TutorStatus.Verified && (
          <div className="absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Verified
          </div>
        )}
        {tutor.matchScore && (
             <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                {tutor.matchScore}% Match
            </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-neutral-800">{tutor.name}</h3>
        <p className="text-sm text-neutral-500 mb-2 truncate">{tutor.bio}</p>
        
        <div className="flex items-center mb-3">
          <RatingStars rating={tutor.rating} />
          <span className="text-xs text-neutral-500 ml-2">({tutor.reviews} reviews)</span>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-neutral-700">Teaches:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {tutor.subjects.slice(0, 2).map(subject => (
              <span key={subject} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">{subject}</span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-4">
                 <p className="text-sm text-neutral-600">Starting from</p>
                 <p className="text-lg font-bold text-primary">ETB {tutor.pricePerHour}<span className="text-sm font-normal text-neutral-500">/hr</span></p>
            </div>
            <div className="flex space-x-2">
                <button onClick={() => navigate(`/tutor/${tutor.id}`)} className="flex-1 text-center bg-white border border-primary text-primary px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/5 transition-colors">
                    View Profile
                </button>
                <button onClick={() => navigate(`/request-confirmation/${tutor.id}`)} className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
                    Request Tutor
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
