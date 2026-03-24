import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCompleteSignup, useSubjects, useGrades } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { useAuthStore } from "../../store/authStore";
import { Role } from "../../types";
import { getErrorMessage } from '../../lib/utils/errorUtils';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { Loader2, ShieldCheck, Phone, User as UserIcon, Lock, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const FinishSignupPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const completeMutation = useCompleteSignup();
    const { registrationData, resetSignup } = useSignupStore();
    const user = useAuthStore((s) => s.user);

    // Determine initial step
    // Social users (no phone) start at Step 1. Normal users skip to Step 2.
    const [step, setStep] = useState<number>(1);
    const [initialized, setInitialized] = useState(false);

    const [activeRole, setActiveRole] = useState<Role>(registrationData.role || user?.role || Role.Student);
    const [phone, setPhone] = useState(registrationData.phone_number || user?.phone_number || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { data: subjects } = useSubjects("All");
    const { data: grades } = useGrades();
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

    useEffect(() => {
        if (user && !initialized) {
            // If phone exists, it's a normal signup or returning user, skip to Step 2
            if (user.phone_number) {
                setStep(2);
            } else {
                setStep(1);
            }
            setInitialized(true);
        }
    }, [user, initialized]);

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (step === 1) {
            if (!phone) {
                setError("Phone number is required.");
                return;
            }
            if (password && password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            setStep(2);
        }
    };

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const data: any = {
            role: activeRole,
            phone_number: phone,
            location: formData.get('location') || registrationData.location || user?.location,
        };

        if (password) {
            data.password = password;
        }

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
            const nextPath = params.get("path") ? `?path=${params.get("path")}` : "";
            navigate(`/verify-phone${nextPath}`);
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    const toggleSubject = (id: number) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                    {/* Stepper Header */}
                    <div className="flex items-center justify-center mb-10 gap-4">
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= 1 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-neutral-200 text-neutral-500'}`}>
                                {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${step >= 1 ? 'text-primary' : 'text-neutral-400'}`}>Account</span>
                        </div>
                        <div className={`w-16 h-1 mb-6 transition-all rounded-full ${step > 1 ? 'bg-primary' : 'bg-neutral-200'}`} />
                        <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= 2 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-neutral-200 text-neutral-500'}`}>
                                2
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${step >= 2 ? 'text-primary' : 'text-neutral-400'}`}>Profile</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                            {step === 1 ? "Essential Details" : "Complete Your Profile"}
                        </h2>
                        <p className="mt-2 text-sm text-neutral-500 font-medium">
                            {step === 1
                                ? "Let's start with your basic account information."
                                : "Tell us more about your educational needs or expertise."}
                        </p>
                    </div>

                    <div className="bg-white py-10 px-8 shadow-2xl shadow-neutral-200/50 rounded-3xl border border-neutral-100">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {step === 1 ? (
                            <form className="space-y-6" onSubmit={handleNextStep}>
                                {/* ROLE SELECTION */}
                                <div>
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                        <UserIcon className="w-3 h-3" />
                                        I want to join as a...
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveRole(Role.Student)}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left group ${activeRole === Role.Student ? 'border-primary bg-primary/5' : 'border-neutral-50 bg-neutral-50 hover:border-neutral-100'}`}
                                        >
                                            <p className={`font-black ${activeRole === Role.Student ? 'text-primary' : 'text-neutral-900'}`}>Student / Parent</p>
                                            <p className="text-xs text-neutral-500 mt-1 font-medium group-hover:text-neutral-600">I'm looking for a qualified tutor.</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveRole(Role.Tutor)}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left group ${activeRole === Role.Tutor ? 'border-primary bg-primary/5' : 'border-neutral-50 bg-neutral-50 hover:border-neutral-100'}`}
                                        >
                                            <p className={`font-black ${activeRole === Role.Tutor ? 'text-primary' : 'text-neutral-900'}`}>Tutor</p>
                                            <p className="text-xs text-neutral-500 mt-1 font-medium group-hover:text-neutral-600">I want to teach and earn money.</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label htmlFor="phone" className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                            <Phone className="w-3 h-3" />
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+251..."
                                            className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label htmlFor="password" className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                                <Lock className="w-3 h-3" />
                                                Set Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="confirmPassword" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">
                                                Confirm Password
                                            </label>
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    Continue to Profile
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-6 animate-in slide-in-from-right-4 duration-500" onSubmit={handleFinish}>
                                <div className="space-y-1">
                                    <label htmlFor="location" className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                        General Location
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        placeholder="e.g. Bole, Addis Ababa"
                                        required
                                        className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white font-bold"
                                    />
                                </div>

                                {activeRole === Role.Tutor ? (
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label htmlFor="title" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Professional Title</label>
                                            <input id="title" name="title" type="text" placeholder="e.g. Senior Math Specialist" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="bio" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Teaching Bio</label>
                                            <textarea id="bio" name="bio" rows={4} required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white" placeholder="Describe your experience and teaching style..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label htmlFor="hourly_rate" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Hourly Rate (ETB)</label>
                                            <div className="relative">
                                                <input id="hourly_rate" name="hourly_rate" type="number" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white font-bold pl-12" placeholder="500" />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-neutral-400">ETB</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Subjects you teach</label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {subjects?.results?.map((s: any) => (
                                                    <button
                                                        key={s.id}
                                                        type="button"
                                                        onClick={() => toggleSubject(s.id)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedSubjects.includes(s.id) ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-neutral-200'}`}
                                                    >
                                                        {s.name}
                                                    </button>
                                                ))}
                                            </div>
                                            {selectedSubjects.length === 0 && <p className="text-[10px] text-red-400 font-bold mt-1 ml-1">Please select at least one subject</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <label htmlFor="grade_level" className="text-xs font-black text-neutral-400 uppercase tracking-widest ml-1">Student Grade Level</label>
                                        <select id="grade_level" name="grade_level" required className="w-full p-4 border-2 border-neutral-50 rounded-2xl transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 bg-neutral-50 focus:bg-white font-bold">
                                            <option value="">Select Grade</option>
                                            {grades?.results?.map((g: any) => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 py-5 rounded-2xl font-black text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={completeMutation.isPending || (activeRole === Role.Tutor && selectedSubjects.length === 0)}
                                        className="flex-grow bg-primary text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {completeMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                Complete Setup
                                                <ShieldCheck className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FinishSignupPage;
