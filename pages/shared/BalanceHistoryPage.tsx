import React from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfileLayout from '../../components/ui/ProfileLayout';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { Role } from '../../types';
import { useBalanceHistory } from '../../features/auth/hooks';
import {
    History,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    TrendingUp,
    Calendar,
    Clock,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { useChapaDeposit, useVerifyPayment } from '../../features/auth/hooks/useChapa';
import { useNotificationStore } from '@/store/notificationStore';
import { useQueryClient } from '@tanstack/react-query';

const BalanceHistoryPage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const { data: balanceData, isLoading } = useBalanceHistory();

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

    const [isDepositModalOpen, setIsDepositModalOpen] = React.useState(false);
    const [depositAmount, setDepositAmount] = React.useState('100');
    const depositMutation = useChapaDeposit();
    const queryClient = useQueryClient();
    const showNotification = useNotificationStore(state => state.showNotification);

    // Check for transaction reference in URL (on return from Chapa)
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const txRef = params.get('tx_ref');
        if (txRef) {
            showNotification("Verifying your payment...", "info");
            // Clear the URL params
            window.history.replaceState({}, document.title, window.location.pathname);

            // Refetch balance after a short delay to allow webhook to process
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['balanceHistory'] });
                queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                showNotification("Payment processed! Your balance should be updated shortly.", "success");
            }, 2000);
        }
    }, []);

    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            showNotification("Please enter a valid amount.", "error");
            return;
        }
        depositMutation.mutate({ amount });
    };

    return (
        <ProfileLayout
            userRole={user?.role === Role.Tutor ? "tutor" : "student"}
            pageTitle="Wallet & Balance"
        >
            <div className="space-y-8 pb-20">
                {/* Balance Hero Card */}
                <div className="bg-neutral-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-neutral-900/20">
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform">
                        <Wallet className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary-light rounded-full text-[10px] font-black tracking-widest mb-6">
                                <TrendingUp className="w-3.5 h-3.5" />
                                CURRENT BALANCE
                            </div>
                            <div className="flex items-baseline gap-4">
                                <h2 className="text-6xl font-black">{balanceData?.balance || user?.balance || "0.00"}</h2>
                                <span className="text-xl font-bold text-neutral-400">ETB</span>
                            </div>
                            <p className="mt-4 text-neutral-400 text-sm max-w-md font-medium">
                                Use your balance to unlock premium leads and start new tutoring sessions.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDepositModalOpen(true)}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary-dark transition-all transform hover:scale-105 shadow-xl shadow-primary/20 flex items-center gap-3"
                            >
                                <CreditCard className="w-4 h-4" />
                                Top Up Balance
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
                    </div>

                    <div className="p-0">
                        {isLoading ? (
                            <div className="p-20 text-center animate-pulse">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 bg-neutral-100 w-48 mx-auto rounded"></div>
                            </div>
                        ) : balanceData?.transactions && balanceData.transactions.length > 0 ? (
                            <div className="divide-y divide-neutral-50">
                                {balanceData.transactions.map((tx) => (
                                    <div key={tx.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.transaction_type === 'deposit'
                                                ? 'bg-green-50 text-green-600 border border-green-100'
                                                : tx.transaction_type === 'withdraw'
                                                    ? 'bg-red-50 text-red-600 border border-red-100'
                                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {tx.transaction_type === 'deposit' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-neutral-900 text-lg leading-tight uppercase">
                                                    {tx.transaction_type.replace('_', ' ')}
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
                                                    <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${tx.status === 'success' ? 'bg-green-100 text-green-600' :
                                                        tx.status === 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {tx.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-2xl font-black ${tx.transaction_type === 'deposit' ? 'text-green-500' : 'text-neutral-900'
                                                }`}>
                                                {tx.transaction_type === 'deposit' ? '+' : '-'}{tx.amount}
                                            </div>
                                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                                                ETB
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-neutral-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                                    <Wallet className="w-10 h-10 text-neutral-200" />
                                </div>
                                <h4 className="text-lg font-black text-neutral-900 mb-2">No Transactions Yet</h4>
                                <p className="text-neutral-400 text-sm max-w-sm mx-auto font-medium">
                                    Top up your balance or start using your account to see your transaction history here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Deposit Modal */}
                {isDepositModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-black text-neutral-900">Deposit Funds</h2>
                                    <button
                                        onClick={() => setIsDepositModalOpen(false)}
                                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-neutral-400" />
                                    </button>
                                </div>

                                <p className="text-neutral-500 font-medium mb-8">
                                    Enter the amount you would like to add to your balance. You will be redirected to Chapa for secure payment.
                                </p>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Amount (ETB)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                                placeholder="100.00"
                                                className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl p-6 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black">ETB</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {[100, 500, 1000].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => setDepositAmount(amt.toString())}
                                                className={`py-3 rounded-2xl font-black text-xs border transition-all ${depositAmount === amt.toString()
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-white border-neutral-100 text-neutral-600 hover:border-neutral-200'
                                                    }`}
                                            >
                                                {amt} ETB
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-10">
                                    <button
                                        onClick={() => setIsDepositModalOpen(false)}
                                        className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors bg-neutral-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeposit}
                                        disabled={depositMutation.isPending}
                                        className="px-6 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {depositMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Pay Now</>}
                                    </button>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2 grayscale opacity-50">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">Secured by Chapa</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default () => (
    <AuthGuard>
        <BalanceHistoryPage />
    </AuthGuard>
);
