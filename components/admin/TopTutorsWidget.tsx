import React from 'react';
import { Tutor } from '../../types';

interface TopTutorsWidgetProps {
  tutors: Tutor[];
}

const TopTutorsWidget: React.FC<TopTutorsWidgetProps> = ({ tutors }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {tutors.map((tutor, index) => (
        <div key={tutor.id} className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
          <img className="w-10 h-10 rounded-full" src={tutor.avatarUrl} alt={tutor.name} />
          <div className="flex-1">
            <p className="font-semibold text-sm">{tutor.name}</p>
            <p className="text-xs text-neutral-500">⭐ {tutor.rating} ({tutor.reviews} reviews)</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTutorsWidget;
