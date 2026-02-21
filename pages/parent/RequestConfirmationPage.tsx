import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TUTORS } from '../../constants';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
const RequestConfirmationPage: React.FC = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const tutor = TUTORS.find(t => t.id === tutorId);
    if (!tutor) {
        return <div>Tutor not found</div>;
    }
    const handleConfirm = () => {
        // Here you would send the request to the backend.
        // For now, we can show an alert and navigate back to the dashboard.
        alert('Your request has been sent! The tutor will respond shortly. You will be notified once the admin approves the session details.');
        navigate('/parent/dashboard');
    }
    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Confirm Your Tutoring Session</h1>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center pb-6 border-b">
                            <img src={tutor.avatarUrl} alt={tutor.name} className="w-16 h-16 rounded-full" />
                            <div className="ml-4">
                                <p className="text-sm text-neutral-500">You are requesting a session with</p>
                                <h2 className="text-xl font-bold">{tutor.name}</h2>
                            </div>
                        </div>
                        <div className="py-6 border-b">
                            <h3 className="font-semibold mb-4 text-neutral-700">Session Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-neutral-500">Subject:</span><span className="font-medium">Mathematics (Example)</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Grade Level:</span><span className="font-medium">Grade 8 (Example)</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Location:</span><span className="font-medium text-right">In-Person at your home (Bole, Addis Ababa)</span></div>
                                <div className="flex justify-between items-center text-red-600"><span className="text-neutral-500">Date & Time:</span><span className="font-medium bg-red-100 px-2 py-1 rounded">Pending Admin & Tutor Approval</span></div>
                                <div className="flex justify-between items-center text-red-600"><span className="text-neutral-500">Meeting Link (Online):</span><span className="font-medium bg-red-100 px-2 py-1 rounded">Available after Approval</span></div>
                            </div>
                        </div>
                        <div className="py-6">
                            <h3 className="font-semibold mb-4 text-neutral-700">Payment Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-neutral-500">Tutor's Hourly Rate:</span><span>ETB {tutor.pricePerHour.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-neutral-500">Platform Fee:</span><span>ETB 50.00</span></div>
                                <div className="flex justify-between font-bold text-lg"><span className="text-neutral-800">Total per Hour:</span><span className="text-primary">ETB {(tutor.pricePerHour + 50).toFixed(2)}</span></div>
                                <p className="text-xs text-neutral-500 pt-2">You will be charged after the session is completed. Payment will be handled via Chapa/Telebirr.</p>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button onClick={() => navigate(-1)} className="w-full text-center bg-white border border-neutral-300 text-neutral-700 px-6 py-3 rounded-md font-semibold hover:bg-neutral-50 transition-colors">
                                Cancel Request
                            </button>
                            <button onClick={handleConfirm} className="w-full text-center bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors">
                                Send Request
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