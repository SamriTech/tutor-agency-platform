
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TutorCard from '../../components/cards/TutorCard';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { getMatchingTutors } from '@/features/parent/hooks/getMatchingTutors';
import { Search, Zap, Star, Filter, Heart, ChevronRight } from 'lucide-react';
import { useTutorFilterStore } from '@/store/tutorFilterStore';
import { useNavigate } from 'react-router-dom';
import { useGrades } from '@/features/auth/hooks';

const ParentDashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const { searchQuery, setSearchQuery, selectedGrade, setSelectedGrade } = useTutorFilterStore();
  const navigate = useNavigate();
  const { data: tutors } = getMatchingTutors({
    search: searchQuery,
    grade_level: selectedGrade
  });
  const { data: gradeOptions } = useGrades();

  const handleSearch = () => {
    navigate('/parent/find-tutors');
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="mt-2 text-neutral-500 font-bold uppercase tracking-widest text-xs">
              Discover the perfect tutors for your learning goals
            </p>
          </div>
          <Link to="/parent/request-status" className="group flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary/20 hover:bg-neutral-50 transition-all shadow-sm">
            Request Status <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Search & Filters Hero */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by subject, level, or tutor name..."
            className="w-full pl-14 pr-32 py-5 bg-white border-2 border-neutral-100 rounded-3xl shadow-xl shadow-neutral-900/5 focus:outline-none focus:border-primary/30 transition-all font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute inset-y-2 right-2 flex gap-2">
            <button
              onClick={handleSearch}
              className="px-5 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10"
            >
              Search
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-8 hidden lg:block">
            <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest">Filters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-3">Grade Level</label>
                  <select
                    value={selectedGrade || ''}
                    onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full p-3 bg-neutral-50 border-2 border-neutral-50 rounded-xl font-bold text-sm focus:border-primary/20 outline-none transition-all"
                  >
                    <option value="">All Grades</option>
                    {gradeOptions?.results?.map((grade: any) => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-3">Availability</label>
                  <div className="space-y-3">
                    {['Weekends', 'Weekdays', 'Evenings'].map(opt => (
                      <label key={opt} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-5 h-5 border-2 border-neutral-200 rounded-md group-hover:border-primary transition-colors"></div>
                        <span className="text-sm font-bold text-neutral-600">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 relative overflow-hidden">
              <Zap className="w-24 h-24 absolute -bottom-4 -right-4 text-primary/10 -rotate-12" />
              <h3 className="text-primary font-black text-sm mb-2">Need Help?</h3>
              <p className="text-primary/70 text-xs font-bold leading-relaxed mb-4">
                Our AI can help you find the perfect tutor based on your specific requirements.
              </p>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest underline underline-offset-4 decoration-2 decoration-primary/20 hover:decoration-primary transition-all">
                Start AI Matching
              </button>
            </div>
          </div>

          {/* AI Matches Section */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-neutral-900 leading-none">Top AI Matches</h2>
                  <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Found {tutors?.count || 0} Recommended Tutors</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                  <Filter className="w-5 h-5 lg:hidden" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tutors?.results.map(tutor => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
              {(!tutors || tutors.results.length === 0) && (
                <div className="col-span-full py-20 bg-white border-2 border-dashed border-neutral-100 rounded-[40px] text-center">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-neutral-200" />
                  </div>
                  <h4 className="text-lg font-black text-neutral-900 mb-2">No Matches Found</h4>
                  <p className="text-neutral-400 text-sm font-medium max-w-xs mx-auto">
                    Try adjusting your filters or search terms to find more tutors.
                  </p>
                </div>
              )}
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
      <ParentDashboardPage />
    </RoleGuard>
  </AuthGuard>
);
