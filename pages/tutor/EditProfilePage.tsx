
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role, User } from '../../types';
import { updateMe } from '@/lib/api/user';
import { getSubjects } from '@/lib/api/user';


const EditTutorProfilePage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const updateUser = useAuthStore(state => state.updateUser);
    const navigate = useNavigate();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [allSubjects, setAllSubjects] = useState<any[]>([]);

    // state will hold the user object from the store or API
    const [tutorData, setTutorData] = useState<User | null>(user);


    React.useEffect(() => {
    getSubjects()
        .then(data => setAllSubjects(data))
        .catch(err => console.error("Failed to load subjects", err));
    }, []); 

    // fetch profile if we don't have it yet
    React.useEffect(() => {
        if (!user) return;
        setTutorData(user);
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!tutorData) return;
        setTutorData(prev => prev ? ({ ...prev, [e.target.name]: e.target.value }) : prev);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tutorData) return;

        try {
            // build payload – here we only send the fields the backend cares about
            const payload = new FormData();
            payload.append('first_name', tutorData.first_name);
            payload.append('last_name', tutorData.last_name);
            payload.append('bio', tutorData.tutor_profile?.bio || '');
            payload.append('hourly_rate', tutorData.tutor_profile?.hourly_rate || '');
            payload.append('location', tutorData.location);
            // you may want to append subjects / expertise as arrays
            tutorData.tutor_profile?.subject.forEach(s => payload.append('subject', s.id.toString()));
            tutorData.tutor_profile?.expertise.forEach(e => payload.append('expertise', e.id.toString()));

            // handle profile photo separately if a file object is present
            if ((tutorData as any).newPhoto) {
                payload.append('photo', (tutorData as any).newPhoto as File);
            }

            const updated = await updateMe(payload);
            setTutorData(updated);
            updateUser(updated);
            alert('Profile updated successfully!');
            navigate('/tutor/dashboard');
        } catch (err) {
            console.error(err);
            alert('Unable to save profile');
        }
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
                                src={photoPreview || tutorData?.photo || '/defaults/default.jpg'}
                                alt={tutorData?.username || ''}
                                className="w-24 h-24 rounded-full"
                            />
                            <div>
                                <label htmlFor="avatarUpload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                    Change profile picture
                                </label>
                                <input
                                    type="file"
                                    id="avatarUpload"
                                    className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (!file || !tutorData) return;
                                        const previewUrl = URL.createObjectURL(file);
                                         setPhotoPreview(previewUrl);
                                         setTutorData({
                                            ...tutorData,
                                             newPhoto: file
                                            } as any);
                                        }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                            <input type="text" name="first_name" id="first_name" value={tutorData?.first_name || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md border-neutral-300" />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700">Bio / Professional Summary</label>
                            <textarea name="bio" id="bio" rows={5} value={tutorData?.tutor_profile?.bio || ''} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md border-neutral-300"></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700">
                                Subjects
                                </label>
                                <select
                                multiple
        className="mt-1 w-full p-2 border rounded-md border-neutral-300 h-40"
        value={tutorData?.tutor_profile?.subject.map(s => s.id) || []}
        onChange={(e) => {
            if (!tutorData) return;

            const selectedIds = Array.from(
                e.target.selectedOptions
            ).map(option => Number(option.value));

            setTutorData({
                ...tutorData,
                tutor_profile: {
                    ...tutorData.tutor_profile!,
                    subject: selectedIds.map(id => ({ id }))
                }
            } as any);
        }}
    >
        {allSubjects.map(subject => (
            <option key={subject.id} value={subject.id}>
                {subject.name}
            </option>
        ))}
    </select>

    <p className="text-xs text-neutral-500 mt-1">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects.
    </p>
</div>

                        
                        <div>
                            <label htmlFor="pricePerHour" className="block text-sm font-medium text-neutral-700">Price Per Hour (ETB)</label>
                            <input
                                type="number"
                                name="hourly_rate"
                                id="hourly_rate"
                                value={tutorData?.tutor_profile?.hourly_rate || ''}
                                onChange={handleInputChange}
                                className="mt-1 w-full p-2 border rounded-md border-neutral-300"
                            />
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
