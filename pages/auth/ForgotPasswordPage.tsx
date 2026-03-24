import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResetPassword } from "@/features/auth/hooks/usePasswordReset";
import { getErrorMessage } from '@/lib/utils/errorUtils';
import { Loader2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const resetMutation = useResetPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!phone) {
            setError("Please enter your phone number.");
            return;
        }

        try {
            await resetMutation.mutateAsync(phone);
            navigate(`/otp?phone=${encodeURIComponent(phone)}&type=reset`);
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="text-center text-4xl font-extrabold text-primary block">Hytor</Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Reset your password
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                    Enter your phone number and we'll send you an OTP to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-8 shadow-xl rounded-2xl sm:px-10 border border-neutral-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+251..."
                                className="w-full px-4 py-3 border-2 border-neutral-50 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50 focus:bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={resetMutation.isPending}
                            className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {resetMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending OTP...
                                </>
                            ) : (
                                'Send OTP Code'
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
