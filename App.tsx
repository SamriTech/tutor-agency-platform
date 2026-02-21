import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TutorDashboardPage from './pages/tutor/TutorDashboardPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TutorProfilePage from './pages/parent/TutorProfilePage';
import RequestConfirmationPage from './pages/parent/RequestConfirmationPage';
import TutorRegistrationPage from './pages/tutor/TutorRegistrationPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';
import RequestStatusPage from './pages/parent/RequestStatusPage';
import EditTutorProfilePage from './pages/tutor/EditProfilePage';
import PaymentSettingsPage from './pages/tutor/PaymentSettingsPage';
import MySessionsPage from './pages/tutor/MySessionsPage';
import SessionPage from './pages/session/SessionPage';

import { AuthGuard } from './features/auth/AuthGuard';
import { Role } from './types';
import { useAuthStore } from './store/authStore';
import AuthInitializer from "./features/auth/AuthInitializer";

const RoleGuard = ({ children, role }) => {

  const user = useAuthStore(state => state.user);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

const App: React.FC = () => {

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans text-neutral-800">
     <AuthInitializer />
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* PARENT */}
          <Route path="/parent/dashboard" element={
            <AuthGuard>
              <RoleGuard role={Role.Parent}>
                <ParentDashboardPage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/parent/profile" element={
            <AuthGuard>
              <RoleGuard role={Role.Parent}>
                <ParentProfilePage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/parent/request-status" element={
            <AuthGuard>
              <RoleGuard role={Role.Parent}>
                <RequestStatusPage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/tutor/:id" element={
            <AuthGuard>
              <RoleGuard role={Role.Parent}>
                <TutorProfilePage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/request-confirmation/:tutorId" element={
            <AuthGuard>
              <RoleGuard role={Role.Parent}>
                <RequestConfirmationPage />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* TUTOR */}
          <Route path="/tutor/dashboard" element={
            <AuthGuard>
              <RoleGuard role={Role.Tutor}>
                <TutorDashboardPage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/tutor/register" element={<TutorRegistrationPage />} />

          <Route path="/tutor/profile/edit" element={
            <AuthGuard>
              <RoleGuard role={Role.Tutor}>
                <EditTutorProfilePage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/tutor/payment-settings" element={
            <AuthGuard>
              <RoleGuard role={Role.Tutor}>
                <PaymentSettingsPage />
              </RoleGuard>
            </AuthGuard>
          } />

          <Route path="/tutor/sessions" element={
            <AuthGuard>
              <RoleGuard role={Role.Tutor}>
                <MySessionsPage />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={
            <AuthGuard>
              <RoleGuard role={Role.Admin}>
                <AdminDashboardPage />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* SHARED */}
          <Route path="/session/:sessionId" element={
            <AuthGuard>
              <SessionPage />
            </AuthGuard>
          } />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </div>
    </HashRouter>
  );
};

export default App;