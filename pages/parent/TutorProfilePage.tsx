import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TUTORS } from '../../backend/frontend/constants';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import RatingStars from '../../components/ui/RatingStars';
import StarIcon from '../../components/icons/StarIcon';
import { TutorStatus, Role } from '../../types';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';

const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);

const Heart = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const Share2 = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

const ShieldCheck = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const Clock = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Calendar = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
);

const Award = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const TutorProfilePage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const tutor = TUTORS.find(t => t.id === id);

    if (!tutor) {
        return (
            <div className="min-h-screen flex flex-col bg-neutral-50">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold mb-4 text-neutral-800">Tutor Not Found</h1>
                    <Link to="/parent/find-tutors" className="text-primary hover:underline font-semibold">
                        Back to Find Tutors
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />

            {/* Breadcrumbs & Actions Row */}
            <div className="border-b border-neutral-100 py-3 bg-neutral-50/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
                    <nav className="flex items-center space-x-2 text-neutral-500">
                        <Link to="/parent/dashboard" className="hover:text-primary">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to="/parent/find-tutors" className="hover:text-primary">Find Tutors</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-neutral-900 font-medium truncate max-w-[150px] md:max-w-none">{tutor.name}</span>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-600">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: Main Details */}
                    <div className="lg:col-span-2">

                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                                <img
                                    src={tutor.avatarUrl}
                                    alt={tutor.name}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl ring-1 ring-neutral-200"
                                />
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-2">{tutor.name}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                                        <div className="flex items-center">
                                            <RatingStars rating={tutor.rating} />
                                            <span className="ml-1 font-bold text-neutral-800">{tutor.rating}</span>
                                            <span className="ml-1 text-neutral-500">({tutor.reviews} reviews)</span>
                                        </div>
                                        <div className="w-px h-4 bg-neutral-300 hidden md:block"></div>
                                        {tutor.status === TutorStatus.Verified && (
                                            <div className="flex items-center text-secondary font-bold">
                                                <ShieldCheck className="w-5 h-5 mr-1" />
                                                Verified Tutor
                                            </div>
                                        )}
                                        <div className="w-px h-4 bg-neutral-300 hidden md:block"></div>
                                        <div className="text-neutral-600 font-medium">{tutor.subjects.length} Subjects Taught</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Me Section */}
                        <section className="mb-10 animate-fade-in">
                            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                                    <Award className="w-5 h-5 text-primary" />
                                </span>
                                About This Tutor
                            </h2>
                            <div className="bg-neutral-50/50 rounded-2xl p-6 md:p-8 border border-neutral-100">
                                <p className="text-neutral-700 leading-relaxed text-lg whitespace-pre-line italic">
                                    "{tutor.bio}"
                                </p>
                            </div>
                        </section>

                        {/* What I Teach */}
                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">Subjects I Teach</h2>
                            <div className="flex flex-wrap gap-3">
                                {tutor.subjects.map(subject => (
                                    <div
                                        key={subject}
                                        className="bg-white border border-neutral-200 px-4 py-2 rounded-xl text-neutral-700 font-semibold shadow-sm hover:shadow-md hover:border-primary transition-all cursor-default"
                                    >
                                        {subject}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education & Experience */}
                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                                <Award className="w-5 h-5 mr-3 text-primary" />
                                Education & Experience
                            </h2>
                            <div className="relative border-l-2 border-primary/20 ml-3 pl-8 space-y-8">
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-1 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm"></div>
                                    <h4 className="font-bold text-neutral-900 text-lg">Professional Experience</h4>
                                    <p className="text-primary font-semibold">{tutor.experience} in Education</p>
                                </div>
                                {tutor.qualifications.map((q, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[41px] top-1 w-4 h-4 bg-neutral-300 rounded-full border-4 border-white shadow-sm"></div>
                                        <p className="text-neutral-700 font-medium leading-snug">{q}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Weekly Schedule */}
                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-primary" />
                                Typical Weekly Availability
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tutor.availability.map(avail => (
                                    <div key={avail.day} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl shadow-sm">
                                        <span className="font-bold text-neutral-800">{avail.day}</span>
                                        <div className="flex flex-wrap gap-2 justify-end">
                                            {avail.times.map(time => (
                                                <span key={time} className="text-xs font-bold px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-neutral-500 flex items-center italic">
                                <Clock className="w-4 h-4 mr-2" />
                                Availability is subject to change based on actual bookings.
                            </p>
                        </section>

                        {/* Reviews Section */}
                        <section>
                            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-3 text-primary" />
                                Parent Reviews ({tutor.reviews})
                            </h2>
                            <div className="space-y-6">
                                {/* Review 1 */}
                                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-4 mb-3">
                                        <img className="w-12 h-12 rounded-full ring-2 ring-neutral-50" src="https://picsum.photos/seed/parent1/100" alt="Parent" />
                                        <div>
                                            <h4 className="font-bold text-neutral-900 leading-none">Aster A.</h4>
                                            <div className="flex mt-1">
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-neutral-700 leading-relaxed italic">
                                        "Abebe is an amazing physics tutor. My son's grades improved significantly after just a few sessions. Highly recommended!"
                                    </p>
                                </div>
                                {/* Review 2 */}
                                <div className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-4 mb-3">
                                        <img className="w-12 h-12 rounded-full ring-2 ring-neutral-50" src="https://picsum.photos/seed/parent2/100" alt="Parent" />
                                        <div>
                                            <h4 className="font-bold text-neutral-900 leading-none">Tilahun G.</h4>
                                            <div className="flex mt-1">
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-neutral-700 leading-relaxed italic">
                                        "Very patient and explains difficult concepts in a way that is easy to understand. My daughter is now confident in her math skills."
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>


                    {/* RIGHT COLUMN: Sticky Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-neutral-200 p-8 sticky top-24 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-neutral-900">Standard Rate</h3>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-primary">ETB {tutor.pricePerHour}</p>
                                    <p className="text-sm text-neutral-500">per hour session</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-neutral-700 font-medium">
                                    <ShieldCheck className="w-5 h-5 mr-3 text-secondary" />
                                    Money-back guarantee
                                </div>
                                <div className="flex items-center text-neutral-700 font-medium">
                                    <MessageSquare className="w-5 h-5 mr-3 text-primary/60" />
                                    Free consultation chat
                                </div>
                                <div className="flex items-center text-neutral-700 font-medium">
                                    <Calendar className="w-5 h-5 mr-3 text-primary/60" />
                                    Flexible rescheduling
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/request-confirmation/${tutor.id}`)}
                                className="w-full bg-primary text-white font-black py-4 rounded-xl text-lg hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all mb-4"
                            >
                                Request Tutor Session
                            </button>

                            <button className="w-full bg-neutral-100 text-neutral-700 font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors">
                                Send a Message
                            </button>

                            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
                                <span>Avg Response Time</span>
                                <span className="text-neutral-600">Under 2 hours</span>
                            </div>
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
            <TutorProfilePage />
        </RoleGuard>
    </AuthGuard>
);
