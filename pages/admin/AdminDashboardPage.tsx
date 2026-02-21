
import React, { useContext, useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthContext } from '../../App';
import { COMMISSIONS, TUTORS, SESSIONS } from '../../constants';
import { TutorStatus, Session } from '../../types';
import AnalyticsDashboard from '../../components/admin/AnalyticsDashboard';
import CommissionsTable from '../../components/admin/CommissionsTable';
import VerificationQueue from '../../components/admin/VerificationQueue';
import TopTutorsWidget from '../../components/admin/TopTutorsWidget';
import SessionMonitor from '../../components/admin/SessionMonitor';
import SessionDetailModal from '../../components/admin/SessionDetailModal';

const AdminDashboardPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const pendingTutors = TUTORS.filter(t => t.status === TutorStatus.Pending);
  const topTutors = [...TUTORS].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const stats = {
    totalRevenue: 45750,
    todayCommissions: 270,
    activeTutors: TUTORS.length,
    totalSessions: 128,
  };

  const handleVerify = (id: string, approved: boolean) => {
    console.log(`Tutor ${id} ${approved ? 'approved' : 'rejected'}`);
  };

  const handleViewSession = (sessionId: string) => {
    const session = SESSIONS.find(s => s.id === sessionId);
    if (session) setSelectedSession(session);
  };

  return (
    <div className="bg-neutral-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
        <p className="mt-1 text-neutral-500">Welcome, {user?.name}. Here's what's happening today.</p>

        <div className="mt-6">
          <AnalyticsDashboard stats={stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content: Commissions & Verification */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Recent Commission Earnings</h2>
              <CommissionsTable commissions={COMMISSIONS} />
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4">Tutor Verification Queue</h2>
              <VerificationQueue tutors={pendingTutors} onVerify={handleVerify} />
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Session Monitoring</h2>
              <SessionMonitor sessions={SESSIONS} onViewDetails={handleViewSession} />
            </section>
          </div>
          
          <aside>
            <h2 className="text-xl font-bold mb-4">Top Performing Tutors</h2>
            <TopTutorsWidget tutors={topTutors} />
          </aside>
        </div>
      </main>
      <Footer />
      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
};

export default AdminDashboardPage;
