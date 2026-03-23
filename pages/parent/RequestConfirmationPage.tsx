import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { useTutorDetails } from '@/features/parent/hooks/useTutorDetails';
import { useCreateTutoringRequest } from '@/features/auth/hooks/useTutoringRequests';

const RequestConfirmationPage: React.FC = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = React.useState('');
    const { data: tutor } = useTutorDetails(tutorId);
    const createRequestMutation = useCreateTutoringRequest();

    const handleConfirm = () => {
        if (tutorId) {
            createRequestMutation.mutate({ tutorId, description }, {
                onSuccess: () => {
                    navigate('/parent/dashboard');
                }
            });
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-black text-center mb-10 tracking-tight text-neutral-900">Confirm Your Tutoring Session</h1>

                    <div className="bg-white rounded-[40px] shadow-2xl shadow-neutral-200/50 p-10 border border-neutral-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />

                        {/* Tutor Profile Header */}
                        <div className="flex items-center pb-8 border-b border-neutral-100">
                            <div className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white shadow-lg">
                                <img src={tutor?.photo} alt={tutor?.username} className="w-full h-full object-cover" />
                            </div>
                            <div className="ml-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Requesting a session with</p>
                                <h2 className="text-2xl font-black text-neutral-900">{tutor?.username}</h2>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="py-8 border-b border-neutral-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-4">How can the tutor help?</h3>
                            <p className="text-sm text-neutral-500 mb-4 font-medium">Adding details helps {tutor?.username} understand your needs and prepare effectively.</p>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., My child needs help with geometry and preparing for the upcoming mid-term exam..."
                                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none min-h-[140px]"
                            />
                        </div>

                        {/* Session Details */}
                        <div className="py-8 border-b border-neutral-100">
                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6">Session Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Subject</span>
                                    <span className="text-sm font-black text-neutral-900 bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-100">Mathematics</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Grade Level</span>
                                    <span className="text-sm font-black text-neutral-900  bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-100">Grade 8</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider mt-1">Location</span>
                                    <span className="text-sm font-black text-neutral-900 text-right max-w-[200px]">In-Person at your home (Bole, Addis Ababa)</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="py-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-6">Payment Summary</h3>
                            <div className="space-y-4 bg-neutral-50/50 rounded-3xl p-6 border border-neutral-100">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-neutral-400 uppercase tracking-wider">Hourly Rate</span>
                                    <span className="font-black text-neutral-900">ETB {Number(tutor?.tutor_profile?.hourly_rate).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-neutral-400 uppercase tracking-wider">Service Fee</span>
                                    <span className="font-black text-neutral-900">ETB 50.00</span>
                                </div>
                                <div className="pt-4 border-t border-neutral-200 flex justify-between items-center">
                                    <span className="text-lg font-black text-neutral-900 uppercase tracking-tight">Total per Hour</span>
                                    <span className="text-2xl font-black text-primary">ETB {(Number(tutor?.tutor_profile?.hourly_rate) + 50).toFixed(2)}</span>
                                </div>
                                <div className="flex items-start gap-2 pt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                                        You will be charged after the session is completed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full px-8 py-5 bg-white border-2 border-neutral-900 text-neutral-900 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-neutral-50 transition-all active:scale-[0.98]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={createRequestMutation.isPending}
                                className="w-full px-8 py-5 bg-primary text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {createRequestMutation.isPending ? "Sending..." : "Send Request"}
                            </button>
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
        <RoleGuard role={Role.Parent}>
            <RequestConfirmationPage />
        </RoleGuard>
    </AuthGuard>
);