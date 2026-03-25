import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import {
  usePendingUserVerifications,
  usePendingQualificationVerifications,
  useVerifyUser
} from '../../features/admin/hooks';
import {
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Loader2,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const { data: pendingUsers, isLoading: loadingUsers } = usePendingUserVerifications();
  const { data: pendingQuals } = usePendingQualificationVerifications();

  const verifyUserMutation = useVerifyUser();
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const stats = [
    { name: 'Identity Verifications', count: pendingUsers?.results?.length || 0, icon: UserCheck, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/users' },
    { name: 'Pending Qualifications', count: pendingQuals?.length || 0, icon: Award, color: 'text-amber-500', bg: 'bg-amber-100', link: '/admin/qualifications' },
    { name: 'System Active Users', count: 'Active', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-100', link: '/admin/users' },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen font-sans">
      <AdminNavbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Welcome back. Here's what needs your attention today.</p>
        </div>
        {/* User Verification Queue - Back by popular demand */}
        <div className="space-y-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-neutral-900">User Identity Verification</h2>
          </div>

          <div className="bg-white rounded-[48px] shadow-sm border border-neutral-100 overflow-hidden">
            {loadingUsers ? (
              <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
            ) : pendingUsers && pendingUsers?.results.length > 0 ? (
              <div className="divide-y divide-neutral-50">
                {pendingUsers?.results.map(u => (
                  <div key={u.id} className="p-6 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer border border-neutral-200" onClick={() => setPreviewImage(u.id_photo)}>
                          {u.id_photo ? (
                            <img src={u.id_photo} alt="ID" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 font-bold text-[8px]">NO PHOTO</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-neutral-900 underline decoration-primary/30">{u.first_name} {u.last_name}</h4>
                          <p className="text-xs text-neutral-400 font-medium">@{u.username} • {u.email}</p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => verifyUserMutation.mutate({ id: u.id, is_id_verified: true, status: 'verified' })}
                              className="px-4 py-2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-green-600 transition-all flex items-center gap-1.5 shadow-md shadow-green-500/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => verifyUserMutation.mutate({ id: u.id, is_id_verified: false, status: 'rejected' })}
                              className="px-4 py-2 bg-neutral-200 text-neutral-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-neutral-300 transition-all flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs">Queue Clear</div>
            )}
          </div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <Link key={i} to={stat.link} className="bg-white p-10 rounded-[48px] shadow-sm border border-neutral-100 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-200 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">{stat.name}</h3>
              <p className="text-5xl font-black text-neutral-900 tracking-tighter">{stat.count}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* Quick Actions / Shortcuts */}
            <div className="bg-neutral-900 rounded-[48px] p-10 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

              <h2 className="text-2xl font-black mb-6">Quick Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <Link to="/admin/users" className="bg-white/10 hover:bg-white/20 p-6 rounded-[32px] transition-colors group">
                  <Users className="w-6 h-6 mb-3 text-primary" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Manage Users</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Ban users or reset passwords</p>
                </Link>
                <Link to="/admin/qualifications" className="bg-white/10 hover:bg-white/20 p-6 rounded-[32px] transition-colors group">
                  <Award className="w-6 h-6 mb-3 text-amber-500" />
                  <h4 className="font-black text-sm uppercase tracking-widest">Moderation</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">Review tutor credentials</p>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[48px] p-10 border border-neutral-100 shadow-sm flex flex-col justify-center">
              <TrendingUp className="w-12 h-12 text-primary mb-6" />
              <h2 className="text-2xl font-black text-neutral-900 mb-2">Platform Growth</h2>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed">
                You're currently monitoring **{pendingUsers?.results?.length || 0}** identity verifications and **{pendingQuals?.length || 0}** pending qualifications.
                Platform activity is up 12% this week.
              </p>
              <button className="mt-8 text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                View Full Reports <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Image Preview Overlay */}
        {previewImage && (
          <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-10 onClick={() => setPreviewImage(null)} cursor-zoom-out">
            <button className="absolute top-10 right-10 text-white hover:text-primary transition-colors">
              <X className="w-10 h-10" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-2xl shadow-2xl animate-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </main>
      <Footer />
      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
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
