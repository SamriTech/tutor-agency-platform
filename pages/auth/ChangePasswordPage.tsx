import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';
import { useChangePassword } from "@/features/auth/hooks/usePasswordReset";
import { getErrorMessage } from '@/lib/utils/errorUtils';
import { Loader2 } from 'lucide-react';

const ChangePasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { showNotification } = useNotificationStore();
    const changeMutation = useChangePassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            setError('Invalid or missing reset token. Please start the process again.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await changeMutation.mutateAsync({
                token,
                password,
                confirm_password: confirmPassword
            });
            showNotification('Password changed successfully! You can now log in.', 'success');
            navigate('/login');
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <div className="bg-white py-10 px-6 shadow-xl rounded-2xl border border-neutral-100">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Access</h2>
                        <p className="text-neutral-600 mb-6">Reset token is missing. Please initiate the password reset process from the forgot password page.</p>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full py-3 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all"
                        >
                            Return to Forgot Password
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Set New Password
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                    Create a strong password for your Hytor account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-neutral-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-neutral-700 mb-2"
                            >
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border-2 border-neutral-50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50 focus:bg-white"
                            />
                            <p className="mt-1 text-xs text-neutral-400">
                                Minimum 8 characters long.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-semibold text-neutral-700 mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border-2 border-neutral-50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50 focus:bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={changeMutation.isPending}
                            className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {changeMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Set New Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
