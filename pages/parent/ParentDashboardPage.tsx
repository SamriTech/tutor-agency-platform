
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TutorCard from '../../components/cards/TutorCard';
import { TUTORS } from '../../constants';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';

const ParentDashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);

  const aiMatches = TUTORS.slice(0, 3);
  const otherTutors = TUTORS.slice(3);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">Welcome back, {user?.username}!</h1>
            <p className="mt-1 text-neutral-500">Here are the best tutors we found based on your request.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link to="/parent/request-status" className="text-sm font-medium text-primary hover:underline">
              View My Request Status →
            </Link>
          </div>
        </div>


        {/* Search Bar */}
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Search for a subject or tutor name..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* AI Matches Section */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-primary mb-4">Top AI Matches For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </section>

        {/* Other Qualified Tutors Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Other Qualified Tutors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default () => (
  <AuthGuard>
    <RoleGuard role={Role.Parent}>
      <ParentDashboardPage />
    </RoleGuard>
  </AuthGuard>
);
