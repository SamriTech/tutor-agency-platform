import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';
import { useVerifyReset } from "@/features/auth/hooks/usePasswordReset";
import { getErrorMessage } from '@/lib/utils/errorUtils';
import { Loader2, ShieldCheck, ArrowLeft, RefreshCcw } from 'lucide-react';

const OTPPage: React.FC = () => {
    const { showNotification } = useNotificationStore();
    const [searchParams] = useSearchParams();
    const phone = searchParams.get('phone') || '';
    const type = searchParams.get('type') || '';

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [error, setError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const verifyResetMutation = useVerifyReset();

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        if (isNaN(Number(value))) return;

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
        const data = e.clipboardData.getData('text').trim().slice(0, 6).split('');
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

    const handleResend = () => {
        if (!canResend) return;
        setTimer(60);
        setCanResend(false);
        // Add resend logic here
        showNotification("Verification code resent!", "success");
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
                // Handle generic OTP logic
                showNotification("Verification successful", "success");
                navigate('/login');
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-neutral-500 hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
                        Verify Your Account
                    </h2>
                    <p className="text-neutral-500 max-w-xs mx-auto">
                        We've sent a 6-digit verification code to your phone <span className="font-semibold text-neutral-900">{phone || 'device'}</span>.
                    </p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl py-10 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl sm:px-10 border border-white/20 relative">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 p-4 rounded-2xl text-center animate-in fade-in slide-in-from-top-1">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-between gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-full h-16 sm:h-20 text-center text-3xl font-bold border-2 border-neutral-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50/50"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <div className="space-y-6">
                            <button
                                type="submit"
                                disabled={otp.join('').length < 6 || verifyResetMutation.isPending}
                                className="w-full py-4 px-6 bg-primary text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(76,29,149,0.3)] hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {verifyResetMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>

                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Resend Code
                                    </button>
                                ) : (
                                    <p className="text-sm text-neutral-400 font-medium">
                                        Resend code in <span className="text-neutral-900 font-bold">{timer}s</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;
