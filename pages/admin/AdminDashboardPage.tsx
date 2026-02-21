
import React, { useContext } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuthStore } from '@/store/authStore';
import { COMMISSIONS, TUTORS } from '../../constants';
import { TutorStatus, Role } from '../../types';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';

const AdminDashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);

  const pendingTutors = TUTORS.filter(t => t.status === TutorStatus.Pending);

  return (
    <div className="bg-neutral-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
        <p className="mt-1 text-neutral-500">Welcome, {user?.name}. Here's what's happening today.</p>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary mt-2">ETB 45,750</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">Commissions (Today)</h3>
            <p className="text-3xl font-bold text-neutral-800 mt-2">ETB 270.00</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">Active Tutors</h3>
            <p className="text-3xl font-bold text-neutral-800 mt-2">{TUTORS.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">Total Sessions</h3>
            <p className="text-3xl font-bold text-neutral-800 mt-2">128</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content: Commissions & Verification */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Commission Earnings */}
            <section>
              <h2 className="text-xl font-bold mb-4">Recent Commission Earnings</h2>
              <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-500">
                  <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Tutor</th>
                      <th scope="col" className="px-6 py-3">Parent</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMISSIONS.map(c => (
                      <tr key={c.id} className="bg-white border-b hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium text-neutral-900">{c.tutorName}</td>
                        <td className="px-6 py-4">{c.parentName}</td>
                        <td className="px-6 py-4">{c.date}</td>
                        <td className="px-6 py-4 font-semibold text-secondary">ETB {c.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tutor Verification Queue */}
            <section>
              <h2 className="text-xl font-bold mb-4">Tutor Verification Queue</h2>
              <div className="bg-white rounded-lg shadow-sm p-4">
                {pendingTutors.length > 0 ? (
                  <p>{pendingTutors.length} tutors waiting for approval.</p>
                ) : (
                  <p className="text-neutral-500">No tutors are currently pending verification. Great job!</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Top Tutors */}
          <aside>
            <h2 className="text-xl font-bold mb-4">Top Performing Tutors</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
              {TUTORS.slice(0, 4).sort((a, b) => b.rating - a.rating).map(tutor => (
                <div key={tutor.id} className="flex items-center space-x-3">
                  <img className="w-10 h-10 rounded-full" src={tutor.avatarUrl} alt={tutor.name} />
                  <div>
                    <p className="font-semibold text-sm">{tutor.name}</p>
                    <p className="text-xs text-neutral-500">Rating: {tutor.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default () => (
  <AuthGuard>
    <RoleGuard role={Role.Admin}>
      <AdminDashboardPage />
    </RoleGuard>
  </AuthGuard>
);
