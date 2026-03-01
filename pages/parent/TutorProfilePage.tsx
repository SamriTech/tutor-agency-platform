
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import RatingStars from '../../components/ui/RatingStars';
import { TutorStatus, User } from '../../types';
import StarIcon from '../../components/icons/StarIcon';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { getUserById } from '@/lib/api/user';

import { getUserAvailability } from "@/lib/api/user";

const TutorProfilePage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


const [availability, setAvailability] = useState<any[]>([]);

useEffect(() => {
  const fetchTutor = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const [user, availabilityData] = await Promise.all([
        getUserById(id),
        getUserAvailability(Number(id)),
      ]);

      setTutor(user);
      setAvailability(availabilityData);
    } catch (err) {
      setError("Unable to load tutor");
    } finally {
      setLoading(false);
    }
  };

  fetchTutor();
}, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!tutor) return <div>Tutor not found</div>;

    return (
        <div className="bg-neutral-50 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Tutor Card */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <img
                            src={
                                 tutor.photo
                                  ? `${tutor.photo}?t=${new Date().getTime()}`
                                    : '/defaults/default.jpg'
                                }
                                alt={tutor.username}
                                className="w-32 h-32 rounded-full mx-auto shadow-md border-4 border-white -mt-20"
/>
                            <h1 className="text-2xl font-bold mt-4 text-center">{tutor.first_name} {tutor.last_name}</h1>
                            {tutor.status === TutorStatus.Verified && (
                                <div className="mt-2 flex justify-center items-center text-secondary font-semibold text-sm">
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    Verified Tutor
                                </div>
                            )}
                            <div className="flex justify-center items-center mt-3">
                                <RatingStars rating={tutor?.rating} />
                                <span className="text-sm text-neutral-500 ml-2">({tutor?.reviews_count || 0} reviews)</span>
                            </div>
                            <p className="text-center text-neutral-600 my-4 text-sm px-4">{tutor.tutor_profile?.bio?.substring(0, 100) ?? ''}...</p>
                            <div className="border-t pt-4">
                                <p className="text-center text-2xl font-bold text-primary">ETB {tutor.tutor_profile?.hourly_rate ?? 0}<span className="text-base font-normal text-neutral-500">/hr</span></p>
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
                                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{tutor.tutor_profile?.bio}</p>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Subjects I Teach</h2>
                                <div className="flex flex-wrap gap-2">
                                    {tutor.tutor_profile?.subject.map(subject => (
                                        <span key={subject.id} className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">{subject.name}</span>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Qualifications & Experience</h2>
                                <ul className="list-disc list-inside space-y-2 text-neutral-600">
                                    {/* replace the placeholders below with real data fetched from qualification endpoint */}
                                    <li><strong>Experience:</strong> {/* e.g. tutor.experience or compute from qualifications */}</li>
                                </ul>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Weekly Availability</h2>
                                <div className="space-y-3">
                                    {availability.length > 0 ? (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">Availability</h3>
    {availability.map((slot) => (
      <div key={slot.id} className="text-sm text-gray-600">
        {slot.day_of_week} — {slot.start_time} to {slot.end_time}
      </div>
    ))}
  </div>
) : (
  <p className="text-sm text-gray-500 mt-2">
    No availability set.
  </p>
)}
                                </div>
                            </section>

                            <section className="mt-8">
                                <h2 className="text-xl font-bold text-neutral-800 border-b pb-2 mb-4">Parent Reviews</h2>
                                <div className="space-y-6">
                                    {/* Mock Review 1 */}
                                    <div className="flex items-start space-x-4">
                                        <img className="w-12 h-12 rounded-full" src="https://picsum.photos/seed/parent1/100" alt="Parent avatar" />
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-semibold">Aster A.</h4>
                                                <div className="flex ml-4">{[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}</div>
                                            </div>
                                            <p className="text-sm text-neutral-600 mt-1">"Abebe is an amazing physics tutor. My son's grades improved significantly after just a few sessions. Highly recommended!"</p>
                                        </div>
                                    </div>
                                    {/* Mock Review 2 */}
                                    <div className="flex items-start space-x-4">
                                        <img className="w-12 h-12 rounded-full" src="https://picsum.photos/seed/parent2/100" alt="Parent avatar" />
                                        <div>
                                            <div className="flex items-center">
                                                <h4 className="font-semibold">Tilahun G.</h4>
                                                <div className="flex ml-4">{[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4 text-amber-400" />)}</div>
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

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Parent}>
            <TutorProfilePage />
        </RoleGuard>
    </AuthGuard>
);
