import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useTutorReviews } from '../../features/auth/hooks';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { Star, MessageSquare, Calendar, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorReviewsPage: React.FC = () => {
    const { data: reviews, isLoading } = useTutorReviews();
    console.log(reviews)
    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Link to="/tutor/dashboard" className="flex items-center text-xs font-black text-primary uppercase tracking-widest mb-4 hover:gap-2 transition-all">
                            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Ratings & Reviews</h1>
                        <p className="mt-2 text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                            Total {reviews?.results?.length || 0} reviews from parents and students
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">Loading reviews...</p>
                    </div>
                ) : reviews && reviews?.results?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews?.results?.map((review) => (
                            <div key={review.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-neutral-100 hover:border-primary/20 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-neutral-900">{review.reviewer_name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-neutral-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="relative">
                                    <MessageSquare className="w-12 h-12 text-primary/5 absolute -top-4 -left-4 -rotate-12 group-hover:rotate-0 transition-transform" />
                                    <p className="text-neutral-600 font-medium leading-relaxed relative z-10 italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-neutral-100">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Star className="w-10 h-10 text-neutral-200" />
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 mb-2">No Reviews Yet</h2>
                        <p className="text-neutral-400 font-medium max-w-sm mx-auto">
                            When parents and students review your tutoring services, they'll appear here.
                        </p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <TutorReviewsPage />
        </RoleGuard>
    </AuthGuard>
);
