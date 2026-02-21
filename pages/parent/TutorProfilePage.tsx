
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TUTORS } from '../../constants';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import RatingStars from '../../components/ui/RatingStars';
import { TutorStatus } from '../../types';
import StarIcon from '../../components/icons/StarIcon';

const TutorProfilePage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const tutor = TUTORS.find(t => t.id === id);

    if (!tutor) {
        return <div>Tutor not found</div>;
    }

    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Tutor Card */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                             <img src={tutor.avatarUrl} alt={tutor.name} className="w-32 h-32 rounded-full mx-auto shadow-md border-4 border-white -mt-20" />
                            <h1 className="text-2xl font-bold mt-4 text-center">{tutor.name}</h1>
                            {tutor.status === TutorStatus.Verified && (
                                <div className="mt-2 flex justify-center items-center text-secondary font-semibold text-sm">
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Verified Tutor
                                </div>
                            )}
                            <div className="flex justify-center items-center mt-3">
                                <RatingStars rating={tutor.rating} />
                                <span className="text-sm text-neutral-500 ml-2">({tutor.reviews} reviews)</span>
                            </div>
                            <p className="text-center text-neutral-600 my-4 text-sm px-4">{tutor.bio.substring(0, 100)}...</p>
                            <div className="border-t pt-4">
                                <p className="text-center text-2xl font-bold text-primary">ETB {tutor.pricePerHour}<span className="text-base font-normal text-neutral-500">/hr</span></p>
                                <button onClick={() => navigate(`/request-confirmation/${tutor.id}`)} className="mt-4 w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors text-lg">
                                    Request This Tutor
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <section>
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">About Me</h2>
                                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
                            </section>
                            
                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Subjects I Teach</h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.subjects.map(subject => (
                                        <span key={subject} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{subject}</span>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Qualifications & Experience</h2>
                                <ul className="list-disc list-inside space-y-2 text-neutral-600">
                                    <li><strong>Experience:</strong> {tutor.experience}</li>
                                    {tutor.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </section>
                            
                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Weekly Availability</h2>
                                <div className="space-y-3">
                                    {tutor.availability.map(avail => (
                                        <div key={avail.day} className="grid grid-cols-3 gap-4 items-center">
                                            <span className="font-semibold text-neutral-700">{avail.day}</span>
                                            <div className="col-span-2 flex flex-wrap gap-2">
                                                {avail.times.map(time => (
                                                    <span key={time} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">{time}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                             <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Parent Reviews</h2>
                                <div className="space-y-6">
                                    {/* Mock Review 1 */}
                                    <div className="flex items-start space-x-4">
                                        <img className="w-12 h-12 rounded-full" src="https://picsum.photos/seed/parent1/100" alt="Parent avatar"/>
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-semibold">Aster A.</h4>
                                                <div className="flex ml-4">{[...Array(5)].map((_,i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}</div>
                                            </div>
                                            <p className="text-sm text-neutral-600 mt-1">"Abebe is an amazing physics tutor. My son's grades improved significantly after just a few sessions. Highly recommended!"</p>
                                        </div>
                                    </div>
                                     {/* Mock Review 2 */}
                                    <div className="flex items-start space-x-4">
                                        <img className="w-12 h-12 rounded-full" src="https://picsum.photos/seed/parent2/100" alt="Parent avatar"/>
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-semibold">Tilahun G.</h4>
                                                <div className="flex ml-4">{[...Array(5)].map((_,i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}</div>
                                            </div>
                                            <p className="text-sm text-neutral-600 mt-1">"Very patient and explains difficult concepts in a way that is easy to understand. My daughter is now confident in her math skills."</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TutorProfilePage;
