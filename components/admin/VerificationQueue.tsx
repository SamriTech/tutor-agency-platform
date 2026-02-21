import React from 'react';
import { Tutor } from '../../types';

interface VerificationQueueProps {
  tutors: Tutor[];
  onVerify: (id: string, approved: boolean) => void;
}

const VerificationQueue: React.FC<VerificationQueueProps> = ({ tutors, onVerify }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {tutors.length === 0 ? (
        <p className="p-4 text-neutral-500">No tutors pending verification</p>
      ) : (
        <div className="divide-y">
          {tutors.map(tutor => (
            <div key={tutor.id} className="p-4 hover:bg-neutral-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img src={tutor.avatarUrl} alt={tutor.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-neutral-900">{tutor.name}</h3>
                    <p className="text-sm text-neutral-500">{tutor.email}</p>
                    <p className="text-sm text-neutral-600 mt-1">{tutor.subjects.join(', ')}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onVerify(tutor.id, true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onVerify(tutor.id, false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;
