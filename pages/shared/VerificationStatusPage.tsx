import React from 'react';
import { useAuthStore } from '@/store/authStore';
import ProfileLayout from '../../components/ui/ProfileLayout';
import { Role } from '../../types';
import { ShieldCheck, Mail, Phone, Lock } from 'lucide-react';

const VerificationStatusPage: React.FC<{ role: Role }> = ({ role }) => {
    const user = useAuthStore(state => state.user);

    const isVerified = user?.is_phone_verified && (role === Role.Parent || user?.tutor_profile?.id_verification_status === 'verified');

    return (
        <ProfileLayout
            userRole={role === Role.Parent ? 'parent' : 'tutor'}
            pageTitle="Verification Status"
        >
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-neutral-100 relative overflow-hidden">
                <div className="flex flex-col items-center text-center max-w-lg mx-auto py-12">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 animate-bounce ${isVerified ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                        <ShieldCheck className="w-12 h-12" />
                    </div>

                    <h2 className="text-3xl font-black text-neutral-900 mb-3 tracking-tight">
                        {isVerified ? 'Account Verified' : 'Verification Pending'}
                    </h2>
                    <p className="text-neutral-500 font-medium mb-12 max-w-sm">
                        {isVerified
                            ? 'Your identity and contact information have been successfully verified. You have full access to all platform features.'
                            : 'Some verification steps are still required. Please complete all items below to unlock full access to hytor.'
                        }
                    </p>

                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl group hover:bg-white border border-transparent hover:border-neutral-100 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <Phone className="w-5 h-5 text-neutral-400" />
                                </div>
                                <div className="text-left">
                                    <span className="text-xs font-black text-neutral-900 uppercase tracking-widest block">Phone Verification</span>
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">SMS Authentication</span>
                                </div>
                            </div>
                            {user?.is_phone_verified ? (
                                <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">VERIFIED</span>
                            ) : (
                                <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">PENDING</span>
                            )}
                        </div>

                        {role === Role.Tutor && (
                            <div className="flex items-center justify-between p-6 bg-neutral-50 rounded-3xl group hover:bg-white border border-transparent hover:border-neutral-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <Lock className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs font-black text-neutral-900 uppercase tracking-widest block">ID Verification</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Official Document Review</span>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${user?.id_verification_status === 'verified' ? 'text-green-500 bg-green-50 border-green-100' :
                                    user?.id_verification_status === 'pending' ? 'text-amber-500 bg-amber-50 border-amber-100' :
                                        'text-neutral-400 bg-neutral-100 border-neutral-200'
                                    }`}>
                                    {(user?.id_verification_status || 'NOT SUBMITTED').toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
};

export default VerificationStatusPage;
