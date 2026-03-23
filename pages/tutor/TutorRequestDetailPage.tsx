import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { useTutoringRequestDetail, useUnlockLead } from '../../features/auth/hooks';
import {
    User,
    Calendar,
    GraduationCap,
    MapPin,
    MessageSquare,
    Zap,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Phone,
    Mail,
    BookOpen
} from 'lucide-react';

const TutorRequestDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: request, isLoading, error } = useTutoringRequestDetail(id);
    const unlockMutation = useUnlockLead();
    console.log(request)
    if (isLoading) {
        return (
            <div className="bg-neutral-50 min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 font-black text-neutral-900 uppercase tracking-widest text-xs">Loading Request...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div className="bg-neutral-50 min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black text-neutral-900 mb-2">Request not found</h2>
                <button onClick={() => navigate('/tutor/sessions')} className="text-primary font-bold hover:underline">Back to dashboard</button>
            </div>
        );
    }

    const handleUnlock = () => {
        if (window.confirm("Unlock this lead for 10.00 ETB?")) {
            unlockMutation.mutate(request.id);
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => navigate('/tutor/sessions')}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-bold text-xs uppercase tracking-widest mb-10 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] p-10 border border-neutral-100 shadow-sm overflow-hidden relative">
                            {/* Decorative Background Icon */}
                            <BookOpen className="absolute -top-10 -right-10 w-64 h-64 text-neutral-50 opacity-50" />

                            <div className="relative z-10">
                                <div className="gap-4 mb-6 flex flex-wrap items-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        TUTORING REQUEST
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green rounded-full text-[10px] font-black tracking-widest">
                                        <GraduationCap className="w-3.5 h-3.5" />
                                        GRADE {request?.grade}
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black text-neutral-900 tracking-tight mb-8">
                                    {request.subject_name} Tutoring
                                </h1>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                        Request Description
                                    </h3>
                                    <div className="p-8 bg-neutral-50 rounded-[32px] border border-neutral-100">
                                        <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                                            {request.is_unlocked
                                                ? request.description
                                                : `${request.description.substring(0, 150)}...`}
                                        </p>
                                        {!request.is_unlocked && (
                                            <div className="mt-6 flex items-center gap-3 text-neutral-400 italic text-sm">
                                                <Zap className="w-4 h-4" />
                                                Unlock this lead to see the full description.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
                                <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Request Date</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-neutral-900" />
                                    </div>
                                    <span className="text-lg font-black text-neutral-900">
                                        {new Date(request.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Parent Identity & Actions */}
                    <div className="space-y-8">
                        <section className="bg-neutral-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                            <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-8">Parent Identity</h3>

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-[40px] overflow-hidden bg-neutral-800 flex items-center justify-center border-4 border-neutral-800 shadow-2xl">
                                        {request.parent_photo ? (
                                            <img src={process.env.VITE_API_URL + request.parent_photo} alt={request.parent_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-neutral-700" />
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-black">
                                        {request.parent_name}
                                    </h4>
                                    <p className="text-neutral-400 font-bold text-sm uppercase tracking-widest mt-1">
                                        Tutoring Lead
                                    </p>
                                </div>

                                <div className="w-full space-y-4 pt-6 border-t border-neutral-800">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-neutral-300 font-medium">{request.location}</span>
                                    </div>
                                    {request.is_unlocked && (
                                        <>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone className="w-4 h-4 text-primary" />
                                                <span className="text-neutral-100 font-bold">{request.parent_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="w-4 h-4 text-primary" />
                                                <span className="text-neutral-100 font-bold">{request.parent_email}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {request.is_unlocked ? (
                                    <div className="w-full space-y-3 pt-4 border-t border-neutral-800">
                                        <button className="w-full flex items-center justify-center gap-3 bg-white text-neutral-900 py-4 rounded-2xl font-black text-sm hover:bg-neutral-100 transition-all">
                                            <MessageSquare className="w-4 h-4" />
                                            Send Message
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full pt-4">
                                        <button
                                            onClick={handleUnlock}
                                            disabled={unlockMutation.isPending}
                                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            {unlockMutation.isPending ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Zap className="w-5 h-5" />
                                            )}
                                            Unlock for 10.00 ETB
                                        </button>
                                        <p className="mt-4 text-[10px] text-neutral-500 font-black uppercase tracking-widest text-center">
                                            Reveals Contact Info & Full Description
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Extra Info */}
                        <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm border-t-4 border-t-primary">
                            <h4 className="text-sm font-black text-neutral-900 mb-4">Lead Security</h4>
                            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                                This lead is exclusive to qualified HYTOR tutors. Unlocking ensures your interest is communicated directly to the parent.
                            </p>
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
            <TutorRequestDetailPage />
        </RoleGuard>
    </AuthGuard>
);
