
import React, { useContext, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { GRADE_LEVELS } from '../../constants';

const ParentProfilePage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    
    // Mock parent data
    const [parentData, setParentData] = useState({
        name: user?.name || 'Parent Name',
        email: user?.email || 'parent@email.com',
        phone: '+251 91 123 4567',
        location: 'Bole, Addis Ababa',
        studentGradeLevel: GRADE_LEVELS[7],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParentData(prev => ({...prev, [name]: value}));
    }

    const handleSave = () => {
        console.log('Saving data:', parentData);
        setIsEditing(false);
    }

    return (
        <div className="bg-neutral-100 min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto">
                     <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-neutral-800">My Profile</h1>
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5">
                                Edit Profile
                            </button>
                        )}
                     </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-6 mb-8">
                            <img 
                                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${parentData.name.replace(' ', '+')}&background=4C1D95&color=fff&size=128`} 
                                alt={parentData.name} 
                                className="w-24 h-24 rounded-full"
                            />
                            <div>
                                <h2 className="text-2xl font-bold">{parentData.name}</h2>
                                <p className="text-neutral-500">{parentData.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-500">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={parentData.name}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={`mt-1 w-full p-2 border rounded-md ${!isEditing ? 'bg-neutral-100 border-neutral-200' : 'border-neutral-300'}`}
                                    placeholder="Enter full name"
                                    title="Full Name"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-neutral-500">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={parentData.phone}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={`mt-1 w-full p-2 border rounded-md ${!isEditing ? 'bg-neutral-100 border-neutral-200' : 'border-neutral-300'}`}
                                    placeholder="Enter phone number"
                                    title="Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-500">Primary Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={parentData.location}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={`mt-1 w-full p-2 border rounded-md ${!isEditing ? 'bg-neutral-100 border-neutral-200' : 'border-neutral-300'}`}
                                    placeholder="Enter primary location"
                                    title="Primary Location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-500">Student's Grade Level</label>
                                 <select
                                    name="studentGradeLevel"
                                    value={parentData.studentGradeLevel}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className={`mt-1 w-full p-2 border rounded-md ${!isEditing ? 'bg-neutral-100 border-neutral-200 appearance-none' : 'border-neutral-300'}`}
                                    title="Student's Grade Level"
                                 >
                                    {GRADE_LEVELS.map(g => <option key={g}>{g}</option>)}
                                 </select>
                            </div>
                            {isEditing && (
                                <div className="flex justify-end gap-4 pt-4">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200">Cancel</button>
                                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Save Changes</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ParentProfilePage;
