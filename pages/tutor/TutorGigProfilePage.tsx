import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
    useUser,
    useUpdateProfile,
    useSubjects,
    useExpertise,
    useQualifications,
    useAddQualification,
    useDeleteQualification,
    useAvailability,
    useAddAvailability,
    useDeleteAvailability,
    checkUsernameAvailability,
    useProfilePasswordChange,
    useRequestPhoneChange,
    useVerifyPhoneChange
} from '@/features/auth/hooks';
import { queryClient } from '../../providers/QueryProvider';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import ProfileLayout from '../../components/ui/ProfileLayout';
import SubjectSelector from '../../components/ui/SubjectSelector';
import ExpertiseSelector from '../../components/ui/ExpertiseSelector';
import {
    ShieldCheck,
    Plus,
    Trash2,
    FileText,
    Image as ImageIcon,
    Camera,
    CheckCircle,
    Clock,
    Calendar,
    Lock,
    Mail,
    User as UserIcon,
    MapPin,
    Save,
    X,
    ChevronDown,
    ChevronUp,
    ShieldQuestion,
    AlertCircle,
    Check,
    Phone
} from 'lucide-react';

const TutorGigProfilePage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    // API Hooks
    const { data: qualifications, isLoading: loadingQuals } = useQualifications();
    const { mutateAsync: addQual, isPending: addingQual } = useAddQualification();
    const { mutateAsync: deleteQual } = useDeleteQualification();
    const { mutateAsync: updateProfile, isPending: updatingProfile } = useUpdateProfile();
    const { data: allSubjects } = useSubjects();
    const { data: allExpertise } = useExpertise();
    const { data: availability, isLoading: loadingAvail } = useAvailability();
    const { mutateAsync: addAvail, isPending: addingAvail } = useAddAvailability();
    const { mutateAsync: deleteAvail } = useDeleteAvailability();
    const { mutateAsync: changePassword, isPending: changingPassword } = useProfilePasswordChange();
    const { mutateAsync: requestPhoneChange, isPending: requestingPhoneChange } = useRequestPhoneChange();
    const { mutateAsync: verifyPhoneChange, isPending: verifyingPhoneChange } = useVerifyPhoneChange();
    const { showNotification } = useNotificationStore();

    const { id } = useParams<{ id: string }>();
    const isAdminEditing = !!id && (user?.role === Role.Admin);
    const targetUserId = id ? parseInt(id) : undefined;

    const { data: targetUser, isLoading: loadingTargetUser, updateMutation: adminUpdateProfile } = useUser(isAdminEditing ? targetUserId : undefined);

    const activeUser = isAdminEditing ? targetUser : user;
    const isUpdating = isAdminEditing ? adminUpdateProfile.isPending : updatingProfile;

    // UI State
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);
    const [idVerificationDropped, setIdVerificationDropped] = useState(false);

    // Username Check State
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Form State
    const [gigData, setGigData] = useState({
        username: activeUser?.username || '',
        firstName: activeUser?.first_name || '',
        lastName: activeUser?.last_name || '',
        email: activeUser?.email || '',
        location: activeUser?.location || '',
        title: activeUser?.tutor_profile?.title || '',
        bio: activeUser?.tutor_profile?.bio || '',
        hourlyRate: activeUser?.tutor_profile?.hourly_rate || '',
        subjects: activeUser?.subject?.map((s: any) => s.id) || [] as number[],
        expertise: activeUser?.tutor_profile?.expertise?.map((e: any) => e.id) || [] as number[]
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [newPhone, setNewPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [idPhoto, setIdPhoto] = useState<File | null>(null);
    const [idPreview, setIdPreview] = useState<string | null>(user?.tutor_profile?.id_photo || null);

    // Sync from user store
    useEffect(() => {
        if (activeUser) {
            setGigData({
                username: activeUser.username || '',
                firstName: activeUser.first_name || '',
                lastName: activeUser.last_name || '',
                email: activeUser.email || '',
                location: activeUser.location || '',
                title: activeUser.tutor_profile?.title || '',
                bio: activeUser.tutor_profile?.bio || '',
                hourlyRate: activeUser.tutor_profile?.hourly_rate || '',
                subjects: activeUser.subject?.map((s: any) => s.id) || [],
                expertise: activeUser.tutor_profile?.expertise?.map((e: any) => e.id) || []
            });
            if (activeUser.tutor_profile?.id_photo) setIdPreview(activeUser.tutor_profile.id_photo);
        }
    }, [activeUser]);

    const checkUsername = async (value: string) => {
        if (!value || value === user?.username) {
            setIsUsernameAvailable(null);
            return;
        }
        setIsCheckingUsername(true);
        try {
            const res = await checkUsernameAvailability(value);
            setIsUsernameAvailable(!res.exists);
        } catch (err) {
            console.error(err);
        } finally {
            setIsCheckingUsername(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setGigData(prev => ({ ...prev, [name]: value }));
        if (name === 'username') checkUsername(value);
    }

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIdPhoto(file);
            setIdPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const formData = new FormData();
        formData.append('username', gigData.username);
        formData.append('first_name', gigData.firstName);
        formData.append('last_name', gigData.lastName);
        formData.append('email', gigData.email);
        formData.append('location', gigData.location);
        formData.append('title', gigData.title);
        formData.append('bio', gigData.bio);
        formData.append('hourly_rate', gigData.hourlyRate.toString());

        if (selectedPhoto) {
            formData.append('photo', selectedPhoto);
        }

        gigData.subjects.forEach(s => formData.append('subject', s.toString()));
        gigData.expertise.forEach(e => formData.append('expertise', e.toString()));
        if (idPhoto) formData.append('id_photo', idPhoto);

        try {
            if (isAdminEditing) {
                await adminUpdateProfile.mutateAsync(formData);
            } else {
                await updateProfile(formData as any);
            }
            setIsEditing(false);
            setIdVerificationDropped(false);
            setSelectedPhoto(null);
            showNotification("Profile updated successfully!", "success");
            queryClient.invalidateQueries();
        } catch (err) {
            showNotification("Error updating profile", "error");
        }
    };

    const handleAddQualification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await addQual(formData);
            e.currentTarget.reset();
            showNotification("Qualification added!", "success");
            queryClient.invalidateQueries();
        } catch (err) {
            showNotification("Error adding qualification", "error");
        }
    };

    const handleAddAvailability = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            day_of_week: parseInt(formData.get('day_of_week') as string),
            start_time: formData.get('start_time') as string,
            end_time: formData.get('end_time') as string,
        };

        try {
            await addAvail(data);
            e.currentTarget.reset();
            showNotification("Availability slot added!", "success");
            queryClient.invalidateQueries();
        } catch (err) {
            showNotification("Error adding availability", "error");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }
        try {
            await changePassword({
                old_password: passwordData.oldPassword,
                new_password: passwordData.newPassword,
                confirm_password: passwordData.confirmPassword
            });
            showNotification("Password changed successfully", "success");
            setShowPasswordChange(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            showNotification(err.response?.data?.error || "Error changing password", "error");
        }
    };

    const handlePhoneChangeRequest = async () => {
        if (!newPhone) return;
        try {
            await requestPhoneChange(newPhone);
            setShowPhoneChangeModal(true);
            showNotification("Verification code sent!", "info");
        } catch (err) {
            showNotification("Error requesting phone change", "error");
        }
    };

    const handlePhoneVerify = async () => {
        try {
            await verifyPhoneChange(verificationCode);
            showNotification("Phone number updated!", "success");
            queryClient.invalidateQueries();
            setShowPhoneChangeModal(false);
            setNewPhone('');
            setVerificationCode('');
        } catch (err) {
            showNotification("Invalid code", "error");
        }
    };

    const toggleSubject = (id: number) => {
        setGigData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(id)
                ? prev.subjects.filter(s => s !== id)
                : [...prev.subjects, id]
        }));
    };

    const toggleExpertise = (id: number) => {
        setGigData(prev => ({
            ...prev,
            expertise: prev.expertise.includes(id)
                ? prev.expertise.filter(e => e !== id)
                : [...prev.expertise, id]
        }));
    };
    console.log(user)
    if (isAdminEditing && loadingTargetUser) return (
        <ProfileLayout userRole="admin" pageTitle="Admin Edit Profile">
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </ProfileLayout>
    );

    return (
        <ProfileLayout userRole={isAdminEditing ? "admin" : "tutor"} pageTitle={isAdminEditing ? `Edit User: ${activeUser?.username}` : "Tutor Profile Management"}>
            <div className="space-y-6 pb-20">
                {/* Header Profile Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="relative group">
                            <input
                                type="file"
                                ref={photoInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <img
                                src={photoPreview || activeUser?.photo || `https://ui-avatars.com/api/?name=${gigData.firstName}+${gigData.lastName}&background=4C1D95&color=fff&size=128`}
                                alt={gigData.username}
                                className="w-24 h-24 rounded-full border-4 border-neutral-50 shadow-sm object-cover transition-transform group-hover:scale-105"
                            />
                            {isEditing && (
                                <button
                                    onClick={() => photoInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white hover:bg-primary-dark transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <h2 className="text-2xl font-black text-neutral-900">{gigData.firstName} {gigData.lastName}</h2>
                                {activeUser?.id_verification_status === 'verified' && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[8px] font-black border border-green-100">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        CERTIFIED
                                    </div>
                                )}
                            </div>
                            <p className="text-neutral-500 font-bold">@{gigData.username}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full border border-primary/10">
                                    {activeUser?.balance || 0} ETB
                                </div>
                                <div className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-black rounded-full border border-neutral-200">
                                    {activeUser?.rating || '0.0'} ⭐ Rating
                                </div>
                                <div className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-black rounded-full border border-neutral-200">
                                    Joined {activeUser?.date_joined ? new Date(activeUser.date_joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-4 px-6 py-2 text-xs font-black text-primary border-2 border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0"
                                    >
                                        <UserIcon className="w-3.5 h-3.5" />
                                        Edit Profile
                                    </button>
                                )}
                                <button className="mt-4 px-6 py-2 text-xs font-black text-secondary border-secondary/20 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0" onClick={() => navigate(`/tutor/${user?.id}`)}>
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
                                <span className="w-1 h-5 bg-primary rounded-full mr-3"></span>
                                Personal Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">First Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={gigData.firstName}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 pl-11 border-2 rounded-xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        />
                                        <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={gigData.lastName}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 pl-11 border-2 rounded-xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        />
                                        <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            value={gigData.username}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 pl-11 pr-12 border-2 rounded-xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'} ${isUsernameAvailable === false ? 'border-red-200 focus:border-red-500' : isUsernameAvailable === true ? 'border-green-200 focus:border-green-500' : ''}`}
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 font-black">@</span>
                                        {isEditing && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {isCheckingUsername ? (
                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                ) : isUsernameAvailable === true ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : isUsernameAvailable === false ? (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && isUsernameAvailable === false && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1">This username is taken</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={gigData.email}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 pl-11 border-2 rounded-xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        />
                                        <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="location"
                                            value={gigData.location}
                                            onChange={handleInputChange}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 pl-11 border-2 rounded-xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        />
                                        <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Overview */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
                                <span className="w-1 h-5 bg-secondary rounded-full mr-3"></span>
                                Gig Configuration
                            </h3>

                            <div className="grid gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Professional Title</label>
                                    <input
                                        type="text"
                                        value={gigData.title}
                                        onChange={e => setGigData({ ...gigData, title: e.target.value })}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 border-2 rounded-2xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        placeholder="e.g. PhD in Theoretical Physics"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Hourly Rate (ETB)</label>
                                        <input
                                            type="number"
                                            value={gigData.hourlyRate}
                                            onChange={e => setGigData({ ...gigData, hourlyRate: e.target.value })}
                                            readOnly={!isEditing}
                                            className={`w-full p-4 border-2 rounded-2xl transition-all outline-none font-bold text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Teaching Subjects</label>
                                        <div className="pt-2">
                                            <SubjectSelector
                                                allSubjects={allSubjects?.results || []}
                                                selectedSubjectIds={gigData.subjects}
                                                onToggle={toggleSubject}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Specialized Expertise</label>
                                    <div className="pt-2">
                                        <ExpertiseSelector
                                            allExpertise={allExpertise?.results || []}
                                            selectedExpertiseIds={gigData.expertise}
                                            onToggle={toggleExpertise}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Biography</label>
                                <textarea
                                    rows={5}
                                    value={gigData.bio}
                                    onChange={e => setGigData({ ...gigData, bio: e.target.value })}
                                    readOnly={!isEditing}
                                    className={`w-full p-4 border-2 rounded-2xl transition-all outline-none font-medium text-sm ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-600' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                    placeholder="Tell students about your teaching philosophy and experience..."
                                />
                            </div>
                        </div>
                    </div>
                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    // Reset logic already handled by sync useEffect
                                }}
                                className="px-6 py-3 text-[10px] font-black text-neutral-500 hover:text-neutral-700 bg-neutral-100 rounded-xl transition-colors uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveProfile()}
                                disabled={isUpdating || isUsernameAvailable === false}
                                className="px-8 py-3 text-[10px] font-black text-white bg-primary rounded-xl hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center space-x-2 disabled:opacity-50 uppercase tracking-widest"
                            >
                                {isUpdating ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>
                    )}

                    {/* ID Verification Section (Conditional) */}
                    {activeUser?.id_verification_status === 'verified' ? (
                        <div className="bg-green-50 p-8 rounded-[32px] text-green-800 overflow-hidden relative flex items-center gap-4 animate-in fade-in duration-500">
                            <ShieldCheck className="w-10 h-10 text-green-600 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-black mb-1">Identity Verified!</h3>
                                <p className="text-sm font-medium">Your identity has been successfully verified. You now have the "Certified Tutor" badge.</p>
                            </div>
                        </div>
                    ) : !idVerificationDropped && (
                        <div className="bg-neutral-900 p-8 rounded-[32px] text-white overflow-hidden relative group animate-in zoom-in-95 duration-500">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transition-transform group-hover:rotate-12">
                                <ShieldCheck className="w-64 h-64" />
                            </div>

                            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/20 text-secondary rounded-full text-[9px] font-black tracking-widest mb-6">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        VERIFICATION REQUIRED
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 leading-tight">Identity & Trust</h3>
                                    <p className="text-neutral-400 font-medium text-xs leading-relaxed mb-8">
                                        Upload your National ID or Passport to unlock the "Certified Tutor" badge and appear higher in search results.
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-3 bg-white text-neutral-900 px-6 py-4 rounded-2xl font-black text-[10px] cursor-pointer hover:bg-neutral-100 transition-all active:scale-95 shadow-lg">
                                            <Camera className="w-4 h-4" />
                                            {idPhoto ? 'Change File' : 'Upload ID Photo'}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleIdChange} />
                                        </label>
                                        {idPhoto && (
                                            <button
                                                onClick={() => handleSaveProfile()}
                                                className="bg-secondary text-white px-8 rounded-2xl font-black text-[10px] hover:bg-secondary/90 transition-all active:scale-95 shadow-lg shadow-secondary/20"
                                            >
                                                Submit for Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="aspect-video bg-white/5 rounded-3xl border-4 border-dashed border-white/10 flex items-center justify-center group/preview relative overflow-hidden">
                                    {idPreview ? (
                                        <>
                                            <img src={idPreview} alt="ID Preview" className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-neutral-900 px-4 py-2 rounded-full">Preview Mode</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">No file selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setIdVerificationDropped(true)}
                                className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                </div>

                {/* Sidebar: Security & Account */}
                <div className="space-y-6">
                    {/* Phone Verification Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                        <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
                            <Phone className="w-5 h-5 mr-3 text-primary" />
                            Phone Update
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Current Number</p>
                                <p className="text-sm font-black text-neutral-700">{activeUser?.phone_number || 'Not set'}</p>
                                {activeUser?.is_phone_verified ? (
                                    <div className="flex items-center mt-1 text-green-500 text-[10px] font-black">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Verified
                                    </div>
                                ) : (
                                    <div className="flex items-center mt-1 text-amber-500 text-[10px] font-black">
                                        <ShieldQuestion className="w-3 h-3 mr-1" />
                                        Unverified
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="tel"
                                    placeholder="+251 ..."
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    className="w-full p-4 text-sm border-2 border-neutral-100 rounded-xl outline-none focus:border-primary transition-all font-bold"
                                />
                                <button
                                    onClick={handlePhoneChangeRequest}
                                    disabled={requestingPhoneChange || !newPhone}
                                    className="w-full py-4 bg-neutral-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 shadow-lg"
                                >
                                    {requestingPhoneChange ? 'Sending OTP...' : 'Update & Verify'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Password Change) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <button
                            onClick={() => setShowPasswordChange(!showPasswordChange)}
                            className="w-full p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                        >
                            <div className="flex items-center">
                                <Lock className="w-5 h-5 mr-3 text-primary" />
                                <span className="font-black text-neutral-900">Security</span>
                            </div>
                            {showPasswordChange ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                        </button>

                        {showPasswordChange && (
                            <form onSubmit={handlePasswordChange} className="px-8 pb-8 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Old Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                        className="w-full p-3 text-sm border-2 border-neutral-100 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                        className="w-full p-3 text-sm border-2 border-neutral-100 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Confirm</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full p-3 text-sm border-2 border-neutral-100 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
                    <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                        Verified Credentials
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-400 rounded-lg text-[10px] font-black tracking-widest">
                            TOTAL: {qualifications?.results?.length || 0}
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {loadingQuals ? (
                        <div className="col-span-full py-20 text-center animate-pulse">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-neutral-100 w-32 mx-auto rounded"></div>
                        </div>
                    ) : qualifications?.results?.map(q => (
                        <div key={q.id} className="group p-6 bg-neutral-50 border border-neutral-100 rounded-3xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 relative">
                            <button
                                onClick={() => deleteQual(q.id)}
                                className="absolute top-4 right-4 p-2 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex gap-4 items-start">
                                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="pr-4">
                                    <div className="text-[8px] font-black text-secondary uppercase tracking-widest mb-1">{q.type}</div>
                                    <h4 className="font-black text-neutral-900 mb-1 leading-tight">{q.title}</h4>
                                    <p className="text-[10px] text-neutral-500 font-medium line-clamp-2">{q.description}</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${q.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {q.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Qualification Form */}
                <div className="bg-neutral-50 rounded-[28px] p-8 border-2 border-dashed border-neutral-200">
                    <h4 className="font-black text-neutral-900 mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Credential
                    </h4>
                    <form onSubmit={handleAddQualification} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Title</label>
                                <input name="title" required className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs" placeholder="e.g. MA in Mathematics" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Type</label>
                                <select name="type" className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs">
                                    <option value="education">University Degree</option>
                                    <option value="certificate">Professional Certificate</option>
                                    <option value="award">Award / Recognition</option>
                                    <option value="work_experience">Teaching Experience</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Evidence (PDF/Image)</label>
                                <label className="flex items-center gap-2 p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs text-neutral-400 cursor-pointer hover:border-primary transition-all">
                                    <FileText className="w-4 h-4" />
                                    Select Files
                                    <input type="file" name="uploaded_images" multiple className="hidden" />
                                </label>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Brief Description</label>
                                <textarea name="description" rows={1} className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-medium text-xs resize-none" placeholder="Context about this qualification..." />
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={addingQual}
                                className="bg-neutral-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-black transition-all disabled:opacity-50"
                            >
                                {addingQual ? 'Saving...' : 'Add Credential +'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 4. Schedule & Availability */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
                    <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary-dark rounded-full"></span>
                        Weekly Availability
                    </h3>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-neutral-100 text-neutral-400 rounded-lg text-[10px] font-black tracking-widest">
                            SLOTS: {availability?.results?.length || 0}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {loadingAvail ? (
                        <div className="col-span-full py-20 text-center animate-pulse">
                            <div className="w-12 h-12 bg-neutral-100 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-neutral-100 w-32 mx-auto rounded"></div>
                        </div>
                    ) : availability?.results?.map(slot => (
                        <div key={slot.id} className="group p-6 bg-neutral-50 border border-neutral-100 rounded-3xl hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300 relative font-bold">
                            <button
                                onClick={() => deleteAvail(slot.id)}
                                className="absolute top-4 right-4 p-2 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-primary uppercase tracking-widest">{slot.day_name}</div>
                                    <div className="text-neutral-900 text-sm flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Availability Form */}
                <div className="bg-neutral-50 rounded-[28px] p-8 border-2 border-dashed border-neutral-200">
                    <h4 className="font-black text-neutral-900 mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add Availability Slot
                    </h4>
                    <form onSubmit={handleAddAvailability} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Day of Week</label>
                            <select name="day_of_week" className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs">
                                <option value="0">Monday</option>
                                <option value="1">Tuesday</option>
                                <option value="2">Wednesday</option>
                                <option value="3">Thursday</option>
                                <option value="4">Friday</option>
                                <option value="5">Saturday</option>
                                <option value="6">Sunday</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Start Time</label>
                            <input name="start_time" type="time" required className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">End Time</label>
                            <input name="end_time" type="time" required className="w-full p-3 bg-white border border-neutral-200 rounded-xl font-bold text-xs" />
                        </div>
                        <div className="md:col-span-3 flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={addingAvail}
                                className="bg-neutral-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-black transition-all disabled:opacity-50"
                            >
                                {addingAvail ? 'Saving...' : 'Add Slot +'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* OTP Verification Modal */}
            {showPhoneChangeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Verify Your New Phone</h3>
                            <p className="text-neutral-500 text-sm mb-6">
                                We've sent a 6-digit verification code to <span className="font-bold text-neutral-900">{newPhone}</span>.
                            </p>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full p-4 text-center text-3xl font-black tracking-[0.5em] border-2 border-neutral-100 rounded-2xl focus:border-primary outline-none transition-all"
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowPhoneChangeModal(false)}
                                        className="flex-1 py-4 bg-neutral-100 text-neutral-500 rounded-2xl font-bold hover:bg-neutral-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePhoneVerify}
                                        disabled={verifyingPhoneChange || verificationCode.length !== 6}
                                        className="flex-2 py-4 px-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        Verify & Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProfileLayout>
    );
};

export default () => (
    <AuthGuard>
        <TutorGigProfilePage />
    </AuthGuard>
);
