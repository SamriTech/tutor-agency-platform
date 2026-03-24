import React from 'react';
import { HashRouter, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminQualificationsPage from './pages/admin/AdminQualificationsPage';
import TutorDashboardPage from './pages/tutor/TutorDashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPhonePage from './pages/auth/VerifyPhonePage';
import OTPPage from './pages/auth/OTPPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import FinishSignupPage from './pages/auth/FinishSignupPage';
import GuestTutorResultsPage from './pages/guest/GuestTutorResultsPage';

import TutorProfilePage from './pages/parent/TutorProfilePage';
import RequestConfirmationPage from './pages/parent/RequestConfirmationPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';
import MyBookingsPage from './pages/parent/MyBookingsPage';
import FindTutorsPage from './pages/parent/FindTutorsPage';
import MySessionsPage from './pages/tutor/MySessionsPage';
import TutorRequestDetailPage from './pages/tutor/TutorRequestDetailPage';
import TutorGigProfilePage from './pages/tutor/TutorGigProfilePage';
import BalanceHistoryPage from './pages/shared/BalanceHistoryPage';
import SessionPage from './pages/session/SessionPage';
import VerificationStatusPage from './pages/shared/VerificationStatusPage';
import AuthInitializer from "./features/auth/AuthInitializer";
import Toast from './components/ui/Toast';
import { Role } from './types';
import { GoogleOAuthProvider } from '@react-oauth/google';


const App: React.FC = () => {
  const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans text-neutral-800">
          <AuthInitializer />
          <Toast />
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/guest/tutors" element={<GuestTutorResultsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-phone" element={<VerifyPhonePage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/finish-signup" element={<FinishSignupPage />} />


            {/* PARENT */}
            <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
            <Route path="/parent/profile" element={<ParentProfilePage />} />
            <Route path="/parent/payment-settings" element={<BalanceHistoryPage />} />
            <Route path="/parent/wallet" element={<BalanceHistoryPage />} />
            <Route path="/parent/find-tutors" element={<FindTutorsPage />} />
            <Route path="/parent/verification" element={<VerificationStatusPage role={Role.Parent} />} />
            <Route path="/parent/bookings" element={<MyBookingsPage />} />
            <Route path="/parent/request-status" element={<MyBookingsPage />} />

            <Route path="/tutor/:id" element={<TutorProfilePage />} />
            <Route path="/request-confirmation/:tutorId" element={<RequestConfirmationPage />} />

            {/* TUTOR */}
            <Route path="/tutor/dashboard" element={<TutorDashboardPage />} />
            <Route path="/tutor/gig-profile" element={<TutorGigProfilePage />} />
            <Route path="/tutor/verification" element={<VerificationStatusPage role={Role.Tutor} />} />
            <Route path="/tutor/payment-settings" element={<BalanceHistoryPage />} />
            <Route path="/tutor/wallet" element={<BalanceHistoryPage />} />

            <Route path="/tutor/sessions" element={<MySessionsPage />} />
            <Route path="/tutor/requests/:id" element={<TutorRequestDetailPage />} />

            {/* ADMIN */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/qualifications" element={<AdminQualificationsPage />} />

            {/* SHARED */}
            <Route path="/session/:sessionId" element={<SessionPage />} />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;