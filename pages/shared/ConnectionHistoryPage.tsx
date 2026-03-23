import React from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfileLayout from '../../components/ui/ProfileLayout';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { useConnectionHistory } from '../../features/auth/hooks';
import {
    History,
    Zap,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    TrendingUp,
    Calendar,
    Clock
} from 'lucide-react';

const ConnectionHistoryPage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const { data: connectionData, isLoading } = useConnectionHistory();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    console.log(user)
    return (
        <ProfileLayout
            userRole={user?.role === Role.Tutor ? "tutor" : "student"}
            pageTitle="Connections & History"
        >
            <div className="space-y-8 pb-20">
                {/* Balance Hero Card */}
                <div className="bg-neutral-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-neutral-900/20">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                        <Zap className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary-light rounded-full text-[10px] font-black tracking-widest mb-6">
                                <TrendingUp className="w-3.5 h-3.5" />
                                CURRENT BALANCE
                            </div>
                            <div className="flex items-baseline gap-4">
                                <h2 className="text-6xl font-black">{connectionData?.connections || user?.connections || 0}</h2>
                                <span className="text-xl font-bold text-neutral-400">Connections</span>
                            </div>
                            <p className="mt-4 text-neutral-400 text-sm max-w-md font-medium">
                                Use connections to contact potential {user?.role === Role.Tutor ? "students" : "tutors"} and start new learning journeys.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl shadow-primary/20 flex items-center gap-3">
                                <CreditCard className="w-4 h-4" />
                                Get More Credits
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] shadow-sm border border-neutral-100 overflow-hidden">
                    <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-neutral-900">Transaction History</h3>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Recent activity on your account</p>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-2">
                            <span className="px-3 py-1 bg-white border border-neutral-200 text-neutral-500 rounded-lg text-[10px] font-black">
                                ALL TIME
                            </span>
                        </div>
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="p-20 text-center animate-pulse">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 bg-neutral-100 w-48 mx-auto rounded"></div>
                            </div>
                        ) : connectionData?.history && connectionData.history.length > 0 ? (
                            <div className="divide-y divide-neutral-50">
                                {connectionData.history.map((tx) => (
                                    <div key={tx.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.transaction_type === 'buy'
                                                ? 'bg-green-50 text-green-600 border border-green-100'
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {tx.transaction_type === 'buy' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-neutral-900 text-lg leading-tight">
                                                    {tx.transaction_type === 'buy' ? 'Purchased Connections' : 'Connection Usage'}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(tx.created_at)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {formatTime(tx.created_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-black ${tx.transaction_type === 'buy' ? 'text-green-500' : 'text-neutral-900'
                                                }`}>
                                                {tx.transaction_type === 'buy' ? '+' : '-'}{tx.amount}
                                            </div>
                                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                                                CREDITS
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-neutral-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-10 h-10 text-neutral-200" />
                                </div>
                                <h4 className="text-lg font-black text-neutral-900 mb-2">No Transactions Yet</h4>
                                <p className="text-neutral-400 text-sm max-w-sm mx-auto font-medium">
                                    Purchase connection credits or start usage to see your transaction history here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default () => (
    <AuthGuard>
        <ConnectionHistoryPage />
    </AuthGuard>
);
