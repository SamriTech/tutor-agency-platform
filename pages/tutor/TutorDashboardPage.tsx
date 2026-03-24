
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuthStore } from '@/store/authStore';
import { TutorStatus, Role } from '../../types';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Zap, Star, User, History, ChevronRight, Loader2 } from 'lucide-react';
import { useTutoringRequests } from '../../features/auth/hooks/useTutoringRequests';

const TutorDashboardPage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const { data, isLoading } = useTutoringRequests();

    // Mock data for demonstration
    const tutorStatus = TutorStatus.Verified;
    const newRequestsCount = data?.new_requests?.length || 0;
    const upcomingSessionsCount = data?.upcoming_requests?.length || 0;

    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Tutor Dashboard</h1>
                    <p className="mt-2 text-neutral-500 font-bold">Welcome back, {user?.first_name || user?.username}!</p>
                </div>

                {tutorStatus !== TutorStatus.Verified && (
                    <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-amber-900 leading-none mb-1">Profile Under Review</p>
                            <p className="text-amber-700/80 text-sm font-medium">Your profile is currently {tutorStatus}. Our team will notify you once the review is complete.</p>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Wallet Balance</h3>
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-4xl font-black text-neutral-900">{user?.balance || "0.00"}</p>
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1 block">ETB</span>
                        </div>
                        <Link to="/tutor/wallet" className="mt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                            Manage Wallet <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Overall Rating</h3>
                                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-4xl font-black text-neutral-900">4.9</p>
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1 block">OUT OF 5.0</span>
                        </div>
                        <Link to="/tutor/gig-profile" className="mt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                            View Public Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">New Requests</h3>
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
                            ) : (
                                <p className="text-4xl font-black text-neutral-900">{newRequestsCount}</p>
                            )}
                        </div>
                        <Link to="/tutor/sessions" className="mt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                            View Requests <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Upcoming Sessions</h3>
                                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                                    <History className="w-5 h-5" />
                                </div>
                            </div>
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
                            ) : (
                                <p className="text-4xl font-black text-neutral-900">{upcomingSessionsCount}</p>
                            )}
                        </div>
                        <Link to="/tutor/sessions" className="mt-6 flex items-center text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                            View Sessions <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="mt-10 bg-neutral-900 p-10 rounded-[40px] shadow-2xl shadow-neutral-900/10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Zap className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Complete Your Profile</h2>
                        <p className="text-neutral-400 font-medium mb-8 leading-relaxed">
                            A complete and detailed profile attracts more parents. Verified tutors with detailed subject lists get 3x more connection requests.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/tutor/gig-profile" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl shadow-primary/20 text-center uppercase tracking-widest">
                                Edit My Profile
                            </Link>
                            <Link to="/tutor/wallet" className="px-8 py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs hover:bg-white/20 transition-all text-center uppercase tracking-widest">
                                Manage Wallet
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <TutorDashboardPage />
        </RoleGuard>
    </AuthGuard>
);
