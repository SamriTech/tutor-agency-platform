import React from 'react';
import { Session } from '../../types';

interface SessionDetailModalProps {
  session: Session | null;
  onClose: () => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Session Details</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 text-2xl">&times;</button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-500">Session ID</label>
              <p className="text-neutral-900">{session.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-500">Status</label>
              <p className="text-neutral-900">{session.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Tutor</h3>
            <div className="flex items-center space-x-3">
              <img src={session.tutor.avatarUrl} alt={session.tutor.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{session.tutor.name}</p>
                <p className="text-sm text-neutral-500">{session.tutor.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Parent</h3>
            <div className="flex items-center space-x-3">
              <img src={session.parent.avatarUrl} alt={session.parent.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{session.parent.name}</p>
                <p className="text-sm text-neutral-500">{session.parent.email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-500">Subject</label>
                <p className="text-neutral-900">{session.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Date</label>
                <p className="text-neutral-900">{session.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Time</label>
                <p className="text-neutral-900">{session.time}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Meeting Link</h3>
            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
              {session.meetingLink}
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
