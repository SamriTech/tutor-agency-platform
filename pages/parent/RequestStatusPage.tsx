import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { Link } from 'react-router-dom';

// Mock data for contacted tutors
const CONTACTED_TUTORS = [
    {
        id: 101,
        tutorName: 'Abel Tesfaye',
        tutorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        subject: 'Mathematics',
        grade: 'Grade 10',
        dateContacted: 'Oct 15, 2024',
        status: 'Pending',
        lastMessage: 'I would love to help! Let me check my schedule for weekends.'
    },
    {
        id: 102,
        tutorName: 'Sara Kebede',
        tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        subject: 'English',
        grade: 'Grade 8',
        dateContacted: 'Oct 12, 2024',
        status: 'Confirmed',
        lastMessage: 'Great, see you this Saturday at 10 AM for our first session.'
    },
    {
        id: 103,
        tutorName: 'Yosef Mekonnen',
        tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        subject: 'Computer Science',
        grade: 'University (Year 1)',
        dateContacted: 'Sep 28, 2024',
        status: 'Cancelled',
        lastMessage: 'Sorry, I am fully booked for this month.'
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Confirmed':
            return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Confirmed</span>;
        case 'Pending':
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Pending Response</span>;
        case 'Cancelled':
            return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Cancelled</span>;
        default:
            return <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-bold rounded-full">{status}</span>;
    }
};

const RequestStatusPage: React.FC = () => {
    const [filter, setFilter] = useState('All');

    const filteredRequests = CONTACTED_TUTORS.filter(req =>
        filter === 'All' ? true : req.status === filter
    );

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Contacted Tutors</h1>
                        <p className="text-neutral-500 mt-1">Track your requests and coordinate with verified experts.</p>
                    </div>

                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-neutral-200">
                        {['All', 'Pending', 'Confirmed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === tab
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRequests.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <ul className="divide-y divide-neutral-100">
                            {filteredRequests.map((request) => (
                                <li key={request.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                                        {/* Avatar & Basic Info */}
                                        <div className="flex items-center gap-4 min-w-[250px]">
                                            <img
                                                src={request.tutorAvatar}
                                                alt={request.tutorName}
                                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <h3 className="text-lg font-bold text-neutral-900">{request.tutorName}</h3>
                                                <p className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">
                                                    {request.subject} • {request.grade}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status & Last Message */}
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                {getStatusBadge(request.status)}
                                                <span className="text-xs text-neutral-400 font-medium">Contacted {request.dateContacted}</span>
                                            </div>
                                            <p className="text-sm text-neutral-600 line-clamp-2 italic">
                                                "{request.lastMessage}"
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 min-w-[140px] mt-4 md:mt-0">
                                            <button className="w-full bg-white border border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                                                Message Tutor
                                            </button>
                                            {request.status === 'Confirmed' && (
                                                <button className="w-full bg-primary text-white hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                                                    View Details
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-neutral-200">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">No Requests Found</h3>
                        <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                            You haven't contacted any tutors yet with the status "{filter}".
                        </p>
                        <Link to="/parent/find-tutors" className="inline-block bg-primary text-white px-6 py-3 rounded-md font-bold hover:bg-primary-dark transition-colors">
                            Browse Tutors
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Parent}>
            <RequestStatusPage />
        </RoleGuard>
    </AuthGuard>
);