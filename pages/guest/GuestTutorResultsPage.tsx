import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useFindTutors } from '../../features/parent/hooks/useFindTutors';
import { Search, MapPin, GraduationCap, Star, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import SEO from '../../components/common/SEO';

const GuestTutorResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const subject = searchParams.get('subject') || '';
    const gradeLevel = searchParams.get('grade_level') || '';
    const location = searchParams.get('location') || '';
    const mode = searchParams.get('mode') || 'Online';

    const { data, isLoading } = useFindTutors({
        matched: true,
        search: subject,
        grade_level: gradeLevel,
        location: location,
        role: 'tutor'
    });

    const tutors = data?.results || [];

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <SEO title="Tutor Results" description="Browse our verified tutors and find the best match for your child." />
            <Header />

            <main className="flex-grow">
                {/* Results Header */}
                <section className="bg-white border-b border-neutral-100 py-12">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                <Star className="w-3 h-3 fill-current" /> AI Matching Engine
                            </div>
                            <h1 className="text-4xl font-black text-neutral-900 mb-4 tracking-tight">
                                Your Ideal Learning Partners
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-500 font-medium">
                                <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                    <GraduationCap className="w-4 h-4 text-primary" /> {subject || "All Subjects"} • {gradeLevel || "Any Grade"}
                                </div>
                                {location && (
                                    <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
                                        <MapPin className="w-4 h-4 text-primary" /> {location}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            {isLoading ? (
                                <div className="py-32 text-center">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Matching you with the best tutors...</p>
                                </div>
                            ) : tutors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {tutors.map((tutor) => (
                                        <div
                                            key={tutor.id}
                                            onClick={() => navigate('/register')}
                                            className="group bg-white rounded-[40px] p-8 border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden relative"
                                        >
                                            {/* Match Score Badge */}
                                            <div className="absolute top-6 right-6 px-4 py-2 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                                Match Score: {tutor.match_score || 90}%
                                            </div>

                                            <div className="flex gap-6 items-start">
                                                <div className="w-20 h-20 rounded-[24px] overflow-hidden border-2 border-primary/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                    <img
                                                        src={tutor.photo || '/defaults/default-avatar.png'}
                                                        alt={tutor.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-black text-neutral-900 group-hover:text-primary transition-colors">
                                                        {tutor.first_name} {tutor.last_name}
                                                    </h3>
                                                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">
                                                        {tutor.tutor_profile?.title || 'Professional Tutor'}
                                                    </p>

                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {tutor.subject?.slice(0, 2).map((s: any) => (
                                                            <span key={s.id} className="px-3 py-1 bg-neutral-50 text-[10px] font-black text-neutral-500 uppercase tracking-tighter rounded-lg border border-neutral-100">
                                                                {s.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-neutral-50 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Starting from</div>
                                                    <div className="text-lg font-black text-neutral-900">ETB {tutor.tutor_profile?.hourly_rate || '---'}<span className="text-xs font-bold text-neutral-400 italic">/hr</span></div>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                                                    Connect Now <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 bg-white rounded-[48px] border-2 border-dashed border-neutral-100 text-center">
                                    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="w-8 h-8 text-neutral-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900 mb-2">No perfect matches yet</h3>
                                    <p className="text-neutral-500 max-w-sm mx-auto mb-8">
                                        Try broadening your search criteria or location to find more qualified tutors.
                                    </p>
                                    <button onClick={() => navigate('/')} className="px-8 py-3 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                                        Back to Search
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* CTA Section */}
                        {!isLoading && tutors.length > 0 && (
                            <div className="mt-20 max-w-4xl mx-auto bg-neutral-900 rounded-[48px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-4">Found your partner?</h2>
                                    <p className="text-neutral-400 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
                                        Create a free account to message these tutors, review their full credentials, and book your first session.
                                    </p>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 group"
                                    >
                                        <UserPlus className="w-5 h-5" /> Start Learning Now <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default GuestTutorResultsPage;
