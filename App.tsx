import React from 'react';
import { HashRouter, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TutorDashboardPage from './pages/tutor/TutorDashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPhonePage from './pages/auth/VerifyPhonePage';
import FinishSignupPage from './pages/auth/FinishSignupPage';
import TutorProfilePage from './pages/parent/TutorProfilePage';
import RequestConfirmationPage from './pages/parent/RequestConfirmationPage';
import TutorRegistrationPage from './pages/tutor/TutorRegistrationPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';
import RequestStatusPage from './pages/parent/RequestStatusPage';
import EditTutorProfilePage from './pages/tutor/EditProfilePage';
import PaymentSettingsPage from './pages/tutor/PaymentSettingsPage';
import MySessionsPage from './pages/tutor/MySessionsPage';
import SessionPage from './pages/session/SessionPage';
import AuthInitializer from "./features/auth/AuthInitializer";

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans text-neutral-800">
        <AuthInitializer />
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/finish-signup" element={<FinishSignupPage />} />

          {/* PARENT */}
          <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
          <Route path="/parent/profile" element={<ParentProfilePage />} />
          <Route path="/parent/request-status" element={<RequestStatusPage />} />
          <Route path="/tutor/:id" element={<TutorProfilePage />} />
          <Route path="/request-confirmation/:tutorId" element={<RequestConfirmationPage />} />

          {/* TUTOR */}
          <Route path="/tutor/dashboard" element={<TutorDashboardPage />} />
          <Route path="/tutor/register" element={<TutorRegistrationPage />} />
          <Route path="/tutor/profile/edit" element={<EditTutorProfilePage />} />
          <Route path="/tutor/payment-settings" element={<PaymentSettingsPage />} />
          <Route path="/tutor/sessions" element={<MySessionsPage />} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

          {/* SHARED */}
          <Route path="/session/:sessionId" element={<SessionPage />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </div>
    </BrowserRouter>
  );
};

export default App;