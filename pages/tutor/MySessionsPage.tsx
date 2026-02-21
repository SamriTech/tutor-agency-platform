
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { SESSIONS } from '../../constants';
import { Session, SessionStatus } from '../../types';

const MySessionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'requests' | 'sessions'>('requests');
    
    const pendingRequests = SESSIONS.filter(s => s.status === SessionStatus.Pending);
    const confirmedSessions = SESSIONS.filter(s => s.status === SessionStatus.Confirmed || s.status === SessionStatus.Completed);
    
    const handleAccept = (session: Session) => {
        alert(`Request from ${session.parent.name} accepted!`);
        // In real app, update session status
    }
    
    const handleDecline = (session: Session) => {
        alert(`Request from ${session.parent.name} declined.`);
    }

    const SessionCard = ({ session }: { session: Session }) => (
        <div className="bg-white p-4 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
                <p className="font-bold">{session.subject} Session</p>
                <p className="text-sm text-neutral-600">With: {session.parent.name}</p>
                <p className="text-sm text-neutral-500">{new Date(session.date).toDateString()} at {session.time}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
                {activeTab === 'requests' ? (
                    <>
                        <button onClick={() => handleAccept(session)} className="px-3 py-1 text-sm font-medium text-white bg-secondary rounded-md hover:bg-green-600">Accept</button>
                        <button onClick={() => handleDecline(session)} className="px-3 py-1 text-sm font-medium text-neutral-700 bg-neutral-200 rounded-md hover:bg-neutral-300">Decline</button>
                    </>
                ) : (
                    <button onClick={() => navigate(session.meetingLink)} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Join Session</button>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-neutral-800 mb-6">My Sessions & Requests</h1>
                
                <div className="border-b border-neutral-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                            Parent Requests ({pendingRequests.length})
                        </button>
                         <button onClick={() => setActiveTab('sessions')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sessions' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}>
                            Upcoming Sessions ({confirmedSessions.length})
                        </button>
                    </nav>
                </div>

                <div className="mt-8 space-y-4">
                    {activeTab === 'requests' && (
                        pendingRequests.length > 0 
                            ? pendingRequests.map(s => <SessionCard key={s.id} session={s} />)
                            : <p className="text-neutral-500">No new parent requests at the moment.</p>
                    )}
                    {activeTab === 'sessions' && (
                        confirmedSessions.length > 0 
                            ? confirmedSessions.map(s => <SessionCard key={s.id} session={s} />)
                            : <p className="text-neutral-500">You have no upcoming sessions scheduled.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MySessionsPage;
