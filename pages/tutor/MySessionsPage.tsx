import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Role } from '../../types';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { useTutoringRequests, useUnlockLead, TutoringRequest } from '../../features/auth/hooks';
import {
    Calendar,
    Clock,
    User,
    Lock,
    Unlock,
    Zap,
    MessageSquare,
    ChevronRight,
    Loader2,
    BookOpen,
    MapPin
} from 'lucide-react';

const MySessionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'leads' | 'sessions'>('leads');
    const { data: requestsData, isLoading: isLoadingRequests } = useTutoringRequests();
    const unlockMutation = useUnlockLead();

    const newRequests = requestsData?.new_requests || [];
    const upcomingSessions = requestsData?.upcoming_requests || [];

    const handleUnlock = (requestId: number) => {
        if (window.confirm("Unlock this lead for 10.00 ETB?")) {
            unlockMutation.mutate(requestId);
        }
    };
    console.log(requestsData)
    const LeadCard: React.FC<{ request: TutoringRequest }> = ({ request }) => (
        <div className={`bg-white rounded-[32px] p-8 border transition-all duration-300 group hover:shadow-xl ${request.is_unlocked ? 'border-primary/20 shadow-primary/5' : 'border-neutral-100 shadow-sm'}`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-neutral-100 flex items-center justify-center border-4 border-white shadow-md">
                            {request.parent_photo ? (
                                <img src={process.env.VITE_API_URL + request.parent_photo} alt={request.parent_name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-neutral-300" />
                            )}
                        </div>
                        {!request.is_unlocked && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neutral-900 rounded-2xl flex items-center justify-center border-2 border-white">
                                <Lock className="w-4 h-4 text-white" />
                            </div>
                        )}
                        {request.is_unlocked && (
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-2xl flex items-center justify-center border-2 border-white">
                                <Unlock className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-black tracking-widest rounded-full">
                                {request.subject_name.toUpperCase()}
                            </span>
                            <span className="text-neutral-400 text-[10px] font-bold">
                                {new Date(request.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-neutral-900">
                            {request.parent_name}
                        </h3>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                                <MapPin className="w-4 h-4 text-primary" />
                                {request.location || "Location not specified"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-end gap-3 min-w-[200px]">
                    {request.is_unlocked ? (
                        <div className="w-full md:w-auto flex flex-col gap-3">
                            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                Start Messaging
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate(`/tutor/requests/${request.id}`)}
                                className="px-8 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                View Information
                            </button>
                        </div>
                    ) : (
                        <div className="w-full md:w-auto flex flex-col gap-3">
                            <button
                                onClick={() => handleUnlock(request.id)}
                                disabled={unlockMutation.isPending}
                                className="px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs hover:bg-neutral-800 transition-all transform hover:scale-105 shadow-xl shadow-neutral-900/20 flex items-center justify-center gap-3"
                            >
                                {unlockMutation.isPending && unlockMutation.variables === request.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Zap className="w-4 h-4 text-primary" />
                                )}
                                Unlock Lead (10.00 ETB)
                            </button>
                            <button
                                onClick={() => navigate(`/tutor/requests/${request.id}`)}
                                className="px-8 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                Preview Lead
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 p-6 bg-neutral-50 rounded-3xl border border-neutral-100 group-hover:bg-white transition-colors">
                <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                    {request.is_unlocked ? request.description : `${request.description.substring(0, 100)}... (Details hidden)`}
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest mb-4">
                            <Zap className="w-3.5 h-3.5" />
                            DISCOVER OPPORTUNITIES
                        </div>
                        <h1 className="text-5xl font-black text-neutral-900 tracking-tight">Tutor Dashboard</h1>
                        <p className="mt-2 text-neutral-500 font-medium">Manage your requests and upcoming sessions.</p>
                    </div>

                    <div className="flex gap-4 p-1.5 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'leads' ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-900'}`}
                        >
                            New Requests ({newRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('sessions')}
                            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all ${activeTab === 'sessions' ? 'bg-neutral-900 text-white shadow-lg' : 'text-neutral-400 hover:text-neutral-900'}`}
                        >
                            Upcoming Sessions ({upcomingSessions.length})
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {isLoadingRequests ? (
                        <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                            <p className="font-black text-xs tracking-widest uppercase">Fetching your leads...</p>
                        </div>
                    ) : activeTab === 'leads' ? (
                        newRequests.length > 0 ? (
                            newRequests.map(request => <LeadCard key={request.id} request={request} />)
                        ) : (
                            <div className="py-32 bg-white rounded-[40px] border border-dashed border-neutral-200 text-center">
                                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-10 h-10 text-neutral-200" />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-2">No New Leads</h3>
                                <p className="text-neutral-500 max-w-sm mx-auto font-medium text-sm">When parents request your expertise, they'll appear here for you to unlock.</p>
                            </div>
                        )
                    ) : (
                        upcomingSessions.length > 0 ? (
                            upcomingSessions.map(request => <LeadCard key={request.id} request={request} />)
                        ) : (
                            <div className="py-32 bg-white rounded-[40px] border border-dashed border-neutral-200 text-center">
                                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-10 h-10 text-neutral-200" />
                                </div>
                                <h3 className="text-2xl font-black text-neutral-900 mb-2">No Upcoming Sessions</h3>
                                <p className="text-neutral-500 max-w-sm mx-auto font-medium text-sm">Seen leads or unlocked sessions will appear here.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <MySessionsPage />
        </RoleGuard>
    </AuthGuard>
);
