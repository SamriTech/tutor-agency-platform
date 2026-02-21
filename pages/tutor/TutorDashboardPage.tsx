
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuthStore } from '@/store/authStore';
import { TutorStatus, Role } from '../../types';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';

const TutorDashboardPage: React.FC = () => {
    const user = useAuthStore(state => state.user);

    // Mock data for demonstration
    const tutorStatus = TutorStatus.Verified;
    const newRequests = 2;

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-neutral-800">Tutor Dashboard</h1>
                <p className="mt-1 text-neutral-500">Welcome back, {user?.name}!</p>

                {tutorStatus !== TutorStatus.Verified && (
                    <div className="mt-6 p-4 bg-amber-100 border-l-4 border-amber-500 text-amber-700 rounded-md">
                        <p className="font-bold">Profile Under Review</p>
                        <p>Your profile is currently {tutorStatus}. Our team will notify you once the review is complete.</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500">Wallet Balance</h3>
                            <p className="text-3xl font-bold text-primary mt-2">ETB 1,250.00</p>
                        </div>
                        <Link to="/tutor/payment-settings" className="mt-4 text-sm font-semibold text-primary hover:underline">Manage Payments →</Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500">Overall Rating</h3>
                            <p className="text-3xl font-bold text-neutral-800 mt-2">4.9 <span className="text-lg text-neutral-400">/ 5.0</span></p>
                        </div>
                        <Link to="/tutor/profile/edit" className="mt-4 text-sm font-semibold text-primary hover:underline">View Public Profile →</Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500">New Requests</h3>
                            <p className="text-3xl font-bold text-neutral-800 mt-2">{newRequests}</p>
                        </div>
                        <Link to="/tutor/sessions" className="mt-4 text-sm font-semibold text-primary hover:underline">View Requests →</Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-neutral-500">Upcoming Sessions</h3>
                            <p className="text-3xl font-bold text-neutral-800 mt-2">1</p>
                        </div>
                        <Link to="/tutor/sessions" className="mt-4 text-sm font-semibold text-primary hover:underline">View Sessions →</Link>
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
                    <p className="text-neutral-600 mb-4">A complete and detailed profile attracts more parents. Make sure yours is up-to-date.</p>
                    {/* Progress Bar can be added here */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/tutor/profile/edit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
                            Edit My Profile
                        </Link>
                        <Link to="/tutor/payment-settings" className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors">
                            Update Payment Settings
                        </Link>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <TutorDashboardPage />
        </RoleGuard>
    </AuthGuard>
);
