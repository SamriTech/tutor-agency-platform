import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useTutorDetails } from '../../features/parent/hooks/useTutorDetails';
import { Star, MapPin, Award, BookOpen, Clock, Globe, ShieldCheck, CheckCircle, ChevronRight, MessageSquare, Send, Loader2 } from 'lucide-react';
import { TutorStatus } from '../../types';

const TutorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: tutor, isLoading, error } = useTutorDetails(id);
    const [activeTab, setActiveTab] = useState<'about' | 'qualifications' | 'availability' | 'reviews'>('about');

    const handleBookSession = () => {
        if (tutor) {
            navigate(`/request-confirmation/${tutor.id}`);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-neutral-50 min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="mt-4 font-black text-neutral-900 uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    if (error || !tutor) {
        return (
            <div className="bg-neutral-50 min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black text-neutral-900 mb-2">Tutor not found</h2>
                <button onClick={() => navigate('/find-tutors')} className="text-primary font-bold hover:underline">Back to search</button>
            </div>
        );
    }
    console.log(tutor)
    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            {/* Profile Hero Section */}
            <div className="bg-white border-b border-neutral-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        {/* Avatar & Verification */}
                        <div className="relative">
                            <img
                                src={tutor.photo || '/defaults/default.jpg'}
                                alt={tutor.username}
                                className="w-32 h-32 md:w-48 md:h-48 rounded-3xl object-cover shadow-2xl border-4 border-white"
                            />
                            {tutor.is_id_verified && (
                                <div className="absolute -bottom-3 -right-3 bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1 border-4 border-white">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    AI-VERIFIED
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-grow space-y-4 w-full">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-4xl font-black text-neutral-900 tracking-tight">
                                    {tutor.first_name} {tutor.last_name}
                                </h1>
                                {tutor.tutor_profile?.title && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                                        {tutor.tutor_profile.title}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-6 text-neutral-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-neutral-900 font-bold">{tutor.rating}</span>
                                    <span>({tutor.reviews_count} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-neutral-400" />
                                    <span>{tutor.location || 'Addis Ababa, Ethiopia'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-neutral-400" />
                                    <span>English, Amharic</span>
                                </div>
                            </div>

                            {/* Key Metrics Cards */}
                            <div className="flex gap-4 pt-4 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 min-w-[140px]">
                                    <div className="text-2xl font-black text-neutral-900">5+ years</div>
                                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Experience</div>
                                </div>
                                <div className="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 min-w-[140px]">
                                    <div className="text-2xl font-black text-neutral-900">100+</div>
                                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Hours Taught</div>
                                </div>
                                <div className="bg-neutral-50 px-6 py-4 rounded-2xl border border-neutral-100 min-w-[140px]">
                                    <div className="text-2xl font-black text-neutral-900">ETB {tutor.tutor_profile?.hourly_rate}</div>
                                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Per Hour</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Desktop */}
                        <div className="hidden lg:block w-72 bg-white p-6 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-200/50 sticky top-24">
                            <div className="mb-6">
                                <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-1">Pricing</div>
                                <div className="flex flex-col items-baseline gap-1">
                                    <p className="text-3xl font-black text-neutral-900">{tutor.tutor_profile?.hourly_rate}</p>
                                    <div className="w-full flex justify-end">
                                        <p className="text-neutral-500 font-bold">ETB / Hr</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleBookSession}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:translate-y-0"
                            >
                                Request a session
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="sticky top-0 bg-white border-b border-neutral-100 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide">
                        {(['about', 'qualifications', 'availability', 'reviews'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-6 text-xs md:text-sm font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-grow">
                        {activeTab === 'about' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section>
                                    <h2 className="text-2xl font-black text-neutral-900 mb-6">About Me</h2>
                                    <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                                        {tutor.tutor_profile?.bio}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black text-neutral-900 mb-6">Expertise</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {tutor.tutor_profile?.subject?.map(s => (
                                            <span key={s.id} className="px-5 py-3 bg-neutral-100 text-neutral-800 rounded-2xl font-bold text-sm">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'qualifications' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-neutral-900">Verified Credentials</h2>
                                {tutor.tutor_profile?.qualifications && tutor.tutor_profile.qualifications.length > 0 ? (
                                    <div className="space-y-6">
                                        {tutor.tutor_profile.qualifications.map(q => (
                                            <div key={q.id} className="flex gap-6 p-8 bg-white border border-neutral-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                                                    {q.type === 'education' ? <Award className="w-8 h-8 text-primary" /> : <CheckCircle className="w-8 h-8 text-secondary" />}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-primary uppercase tracking-widest mb-1">{q.type}</div>
                                                    <h4 className="text-xl font-black text-neutral-900 mb-1">{q.title}</h4>
                                                    <p className="text-neutral-500 font-bold mb-4">{q.description}</p>
                                                    {q.status === 'approved' && (
                                                        <div className="flex items-center gap-2 text-secondary text-sm font-black uppercase tracking-tighter">
                                                            <ShieldCheck className="w-4 h-4" />
                                                            Verified
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-neutral-400 font-bold italic py-8">No verified credentials listed yet.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'availability' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-black text-neutral-900 mb-2">Weekly Schedule</h2>
                                    <p className="text-neutral-500 font-medium italic">Available slots for tutoring sessions.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tutor.tutor_profile?.availabilities && tutor.tutor_profile.availabilities.length > 0 ? (
                                        tutor.tutor_profile.availabilities.map(slot => (
                                            <div key={slot.id} className="bg-white p-6 border border-neutral-100 rounded-2xl shadow-sm flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][slot.day_of_week]}
                                                    </div>
                                                    <div className="font-bold text-neutral-900">
                                                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-neutral-400 font-bold italic py-8">No specific availability listed. Contact the tutor for custom arrangements.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-black text-neutral-900">{tutor.reviews_count} Parent Testimonials</h2>
                                <div className="grid gap-6">
                                    {tutor.reviews_received && tutor.reviews_received.length > 0 ? (
                                        tutor.reviews_received.map((r) => (
                                            <div key={r.id} className="p-8 bg-white border border-neutral-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center font-black text-neutral-300">
                                                            {(r.reviewer_name || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-black text-neutral-900">{r.reviewer_name}</h5>
                                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Parent</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-yellow-500">
                                                        {[...Array(5)].map((_, j) => (
                                                            <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'fill-yellow-500' : 'text-neutral-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-neutral-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-neutral-400 font-bold italic py-8">No testimonials yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column Sidebar */}
                    <div className="lg:w-80 flex-shrink-0 space-y-6">
                        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                            <h4 className="text-lg font-black text-primary mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Direct Message
                            </h4>
                            <p className="text-sm font-medium text-primary/70 mb-6 leading-relaxed">
                                Need custom arrangements? Message the tutor directly.
                            </p>
                            <button className="w-full flex items-center justify-center gap-2 bg-white text-primary py-3 rounded-2xl font-black text-sm border-2 border-primary/10 hover:bg-neutral-50 transition-all">
                                Chat Now
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-neutral-900 p-8 rounded-3xl text-white">
                            <h4 className="text-lg font-black mb-6">Why Hytor Verified?</h4>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm font-medium items-start">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <span>Vetted academic backgrounds</span>
                                </li>
                                <li className="flex gap-3 text-sm font-medium items-start">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <span>Satisfaction guarantee</span>
                                </li>
                                <li className="flex gap-3 text-sm font-medium items-start">
                                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <span>Secure weekly payments</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TutorProfilePage;
