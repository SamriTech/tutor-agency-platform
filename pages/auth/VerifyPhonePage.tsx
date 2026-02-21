import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyOtp, useResendOtp } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from '../../lib/utils/errorUtils';

const VerifyPhonePage: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const verifyMutation = useVerifyOtp();
    const resendMutation = useResendOtp();
    const registrationData = useSignupStore((s) => s.registrationData);
    const user = useAuthStore((s) => s.user);

    const phoneNumber = registrationData.phone_number || user?.phone_number;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            await verifyMutation.mutateAsync({ otp });
            navigate('/');
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    const handleResend = async () => {
        setError(null);
        setSuccessMessage(null);
        try {
            const res: any = await resendMutation.mutateAsync();
            setSuccessMessage(res.data.message || "Code resent successfully!");
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Verify your phone
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                    We've sent a code to <span className="font-semibold text-neutral-900">{phoneNumber || 'your phone'}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleVerify}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-50 border-l-4 border-green-400 p-4">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 text-center">
                                Enter 6-digit code
                            </label>
                            <div className="mt-4 flex justify-center">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    className="appearance-none block w-48 text-center px-3 py-3 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary text-2xl tracking-[0.5em] font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                type="submit"
                                disabled={verifyMutation.isPending || otp.length < 4}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {verifyMutation.isPending ? 'Verifying...' : 'Verify Phone'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendMutation.isPending}
                                className="text-sm text-primary hover:text-primary-dark font-medium text-center disabled:opacity-50"
                            >
                                {resendMutation.isPending ? 'Sending...' : 'Resend Code'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyPhonePage;
