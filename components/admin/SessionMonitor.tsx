import React from 'react';
import { Session, SessionStatus } from '../../types';

interface SessionMonitorProps {
  sessions: Session[];
  onViewDetails: (sessionId: string) => void;
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({ sessions, onViewDetails }) => {
  const getStatusColor = (status: SessionStatus) => {
    const colors = {
      [SessionStatus.Confirmed]: 'bg-green-100 text-green-800',
      [SessionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
      [SessionStatus.Completed]: 'bg-blue-100 text-blue-800',
      [SessionStatus.Cancelled]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-neutral-100 text-neutral-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left">Session ID</th>
            <th className="px-6 py-3 text-left">Tutor</th>
            <th className="px-6 py-3 text-left">Parent</th>
            <th className="px-6 py-3 text-left">Subject</th>
            <th className="px-6 py-3 text-left">Date & Time</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id} className="border-b hover:bg-neutral-50">
              <td className="px-6 py-4 font-medium">{session.id}</td>
              <td className="px-6 py-4">{session.tutor.name}</td>
              <td className="px-6 py-4">{session.parent.name}</td>
              <td className="px-6 py-4">{session.subject}</td>
              <td className="px-6 py-4">{session.date} {session.time}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button onClick={() => onViewDetails(session.id)} className="text-primary hover:underline">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionMonitor;
