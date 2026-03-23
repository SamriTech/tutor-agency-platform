import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@/store/notificationStore';

const OTPPage: React.FC = () => {
    const { showNotification } = useNotificationStore();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            console.log('OTP Submitted:', otpValue);
            // Backend integration would go here
            showNotification(`OTP Submitted: ${otpValue}`, 'success');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Verify OTP
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                    Please enter the 6-digit code sent to your device.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-neutral-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
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
                                    className="w-12 h-16 sm:w-14 sm:h-20 text-center text-3xl font-bold border-2 border-neutral-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-neutral-50"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={otp.join('').length < 6}
                                className="w-full py-4 px-6 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none"
                            >
                                Verify Code
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
