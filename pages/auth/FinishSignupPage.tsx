import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCompleteSignup, useSubjects, useGrades } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { useAuthStore } from "../../store/authStore";
import { Role } from "../../types";
import { getErrorMessage } from '../../lib/utils/errorUtils';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';

const FinishSignupPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const completeMutation = useCompleteSignup();
    const { registrationData, resetSignup } = useSignupStore();
    const user = useAuthStore((s) => s.user);
    const activeRole = registrationData.role || user?.role || Role.Student;

    const { data: subjects } = useSubjects("All");
    const { data: grades } = useGrades();
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

    useEffect(() => {
        if (!user && !registrationData.username) {
            // navigate('/login');
        }
    }, [user, registrationData]);

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const data: any = {
            role: activeRole,
            phone_number: registrationData.phone_number || user?.phone_number,
            location: registrationData.location || user?.location,
        };

        if (activeRole === Role.Tutor) {
            data.bio = formData.get('bio');
            data.hourly_rate = formData.get('hourly_rate');
            data.subject = selectedSubjects;
            data.title = formData.get('title');
        } else {
            data.grade_level = formData.get('grade_level');
        }

        try {
            await completeMutation.mutateAsync(data);
            resetSignup();
            if (params.get("path")) {
                navigate(`/verify-phone?path=${params.get("path")}`);
            } else {
                navigate('/verify-phone');
            }
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    const toggleSubject = (id: number) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };
    console.log(subjects)
    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                {params.get("path") && (
                    <div className="max-w-md mx-auto mb-4 w-full">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex justify-between items-center">
                            <p className="text-sm text-yellow-700 font-medium">Please finish setting up your profile to continue.</p>
                        </div>
                    </div>
                )}

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-black text-neutral-900 tracking-tight">
                        One last thing...
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-500 font-bold uppercase tracking-widest">
                        complete your {activeRole} profile
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-10 px-8 shadow-2xl shadow-neutral-200/50 sm:rounded-3xl border border-neutral-100">
                        <form className="space-y-6" onSubmit={handleFinish}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            {activeRole === Role.Tutor ? (
                                <>
                                    <div className="space-y-1">
                                        <label htmlFor="title" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Professional Title</label>
                                        <input id="title" name="title" type="text" placeholder="e.g. Senior Math Specialist" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="bio" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Teaching Bio</label>
                                        <textarea id="bio" name="bio" rows={4} required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white" placeholder="Describe your experience and teaching style..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="hourly_rate" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Hourly Rate (ETB)</label>
                                        <input id="hourly_rate" name="hourly_rate" type="number" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white" placeholder="e.g. 500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Subjects you teach</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {subjects?.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => toggleSubject(s.id)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedSubjects.includes(s.id) ? 'bg-primary border-primary text-white' : 'bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-neutral-200'}`}
                                                >
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                        {selectedSubjects.length === 0 && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1">Please select at least one subject</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-1">
                                    <label htmlFor="grade_level" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Student Grade Level</label>
                                    <select id="grade_level" name="grade_level" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white">
                                        <option value="">Select Grade</option>
                                        {grades?.map(g => (
                                            <option key={g.id} value={g.id}>{g.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={completeMutation.isPending || (activeRole === Role.Tutor && selectedSubjects.length === 0)}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
                                >
                                    {completeMutation.isPending ? 'Propagating data...' : 'Verify Phone Number →'}
                                </button>
                                <p className="text-center text-[10px] text-neutral-400 font-bold mt-4 uppercase tracking-tighter">
                                    Final step before verification
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FinishSignupPage;
