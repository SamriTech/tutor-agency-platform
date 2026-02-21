import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompleteSignup } from "../../features/auth/hooks";
import { useSignupStore } from "../../store/signupStore";
import { useAuthStore } from "../../store/authStore";
import { Role } from "../../types";
import { getErrorMessage } from '../../lib/utils/errorUtils';

const FinishSignupPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const completeMutation = useCompleteSignup();
    const { registrationData, resetSignup } = useSignupStore();
    const user = useAuthStore((s) => s.user);

    const activeRole = registrationData.role || user?.role || Role.Student;

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const data: any = {};
        if (activeRole === Role.Tutor) {
            data.bio = formData.get('bio');
            data.hourly_rate = formData.get('hourly_rate');
            // For simplicity in this step, we might want to handle subjects/expertise separately 
            // but let's at least provide the basic fields.
        } else {
            data.grade_level = formData.get('grade_level');
        }

        try {
            await completeMutation.mutateAsync(data);
            resetSignup();
            navigate('/verify-phone');
        } catch (err: any) {
            setError(getErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
                    One last thing...
                </h2>
                <p className="mt-2 text-center text-sm text-neutral-600">
                    Tell us a bit more about yourself to complete your {activeRole} profile.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleFinish}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {activeRole === Role.Tutor ? (
                            <>
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-neutral-700">Bio</label>
                                    <textarea id="bio" name="bio" rows={4} required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Describe your experience and teaching style..." />
                                </div>
                                <div>
                                    <label htmlFor="hourly_rate" className="block text-sm font-medium text-neutral-700">Hourly Rate (USD)</label>
                                    <input id="hourly_rate" name="hourly_rate" type="number" step="0.01" required className="mt-1 appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label htmlFor="grade_level" className="block text-sm font-medium text-neutral-700">Student Grade Level</label>
                                <select id="grade_level" name="grade_level" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                    <option value="">Select Grade</option>
                                    <option value="Elementary">Elementary (1-5)</option>
                                    <option value="Middle School">Middle School (6-8)</option>
                                    <option value="High School">High School (9-12)</option>
                                    <option value="University">University</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={completeMutation.isPending}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                            >
                                {completeMutation.isPending ? 'Saving...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FinishSignupPage;
