import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';
import { useVerifyReset } from "@/features/auth/hooks/usePasswordReset";
import { getErrorMessage } from '@/lib/utils/errorUtils';
import { Loader2 } from 'lucide-react';

const OTPPage: React.FC = () => {
    const { showNotification } = useNotificationStore();
    const [searchParams] = useSearchParams();
    const phone = searchParams.get('phone') || '';
    const type = searchParams.get('type') || '';

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const verifyResetMutation = useVerifyReset();

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6).split('');
        if (data.length === 0) return;

        const newOtp = [...otp];
        data.forEach((char, index) => {
            if (!isNaN(Number(char)) && index < 6) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);

        // Focus last filled input or the first empty one
        const lastIndex = Math.min(data.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        try {
            if (type === 'reset') {
                const result = await verifyResetMutation.mutateAsync({ code: otpValue });
                if (result.data.status === 'success') {
                    showNotification("OTP verified successfully!", "success");
                    navigate(`/change-password?token=${result.data.token}`);
                } else {
                    setError(result.data.message || "Invalid OTP code.");
                }
            } else {
                // Handle generic OTP logic if needed
                console.log('OTP Submitted:', otpValue);
                showNotification(`OTP Submitted: ${otpValue}`, 'success');
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Verify OTP
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                    Please enter the 6-digit code sent to <span className="font-semibold text-neutral-900">{phone || 'your device'}</span>.
                    <p className="mb-0">(12345) is the code for testing</p>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-neutral-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl text-center">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-between gap-2 sm:gap-4">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    value={data}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-10 h-14 sm:w-14 sm:h-20 text-center text-2xl sm:text-3xl font-bold border-2 border-neutral-100 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={otp.join('').length < 6 || verifyResetMutation.isPending}
                                className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {verifyResetMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-sm font-medium text-primary hover:text-primary-dark hover:underline"
                                >
                                    Didn't receive the code? Resend
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;
