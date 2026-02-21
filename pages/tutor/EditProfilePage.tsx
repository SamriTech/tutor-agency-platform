
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuthStore } from '@/store/authStore';
import { TUTORS } from '../../constants';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';

const EditTutorProfilePage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    // Find the current tutor's data to pre-fill the form
    const currentTutor = TUTORS.find(t => t.email === user?.email) || TUTORS[0];
    const [tutorData, setTutorData] = useState(currentTutor);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTutorData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving tutor profile:", tutorData);
        alert("Profile updated successfully!");
        navigate('/tutor/dashboard');
    };

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-neutral-800 mb-6">Edit My Profile</h1>
                    <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src={tutorData.avatarUrl}
                                alt={tutorData.name}
                                className="w-24 h-24 rounded-full"
                            />
                            <div>
                                <label htmlFor="avatarUpload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                    Change profile picture
                                </label>
                                <input type="file" id="avatarUpload" className="hidden" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                            <input type="text" name="name" id="name" value={tutorData.name} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700">Bio / Professional Summary</label>
                            <textarea name="bio" id="bio" rows={5} value={tutorData.bio} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md border-neutral-300"></textarea>
                        </div>

                        <div>
                            <label htmlFor="subjects" className="block text-sm font-medium text-neutral-700">Subjects (comma-separated)</label>
                            <input type="text" name="subjects" id="subjects" value={tutorData.subjects.join(', ')} onChange={e => setTutorData(p => ({ ...p, subjects: e.target.value.split(',').map(s => s.trim()) }))} className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                        </div>

                        <div>
                            <label htmlFor="pricePerHour" className="block text-sm font-medium text-neutral-700">Price Per Hour (ETB)</label>
                            <input type="number" name="pricePerHour" id="pricePerHour" value={tutorData.pricePerHour} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                        </div>

                        {/* A more complex availability editor would be needed in a real app */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Availability</label>
                            <p className="text-sm text-neutral-500">Edit your availability schedule (UI placeholder).</p>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/tutor/dashboard')} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Save Changes</button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Tutor}>
            <EditTutorProfilePage />
        </RoleGuard>
    </AuthGuard>
);
