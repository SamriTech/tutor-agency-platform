import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import {
    useGrades,
    useUser,
    useUpdateProfile,
    useSubjects,
    checkUsernameAvailability,
    useProfilePasswordChange,
    useRequestPhoneChange,
    useVerifyPhoneChange,
    useDeleteAccount,
    useLogout
} from '@/features/auth/hooks';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../../providers/QueryProvider';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import ProfileLayout from '../../components/ui/ProfileLayout';
import SubjectSelector from '../../components/ui/SubjectSelector';
import {
    Check,
    AlertCircle,
    Lock,
    Phone,
    Mail,
    User as UserIcon,
    MapPin,
    Save,
    X,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    ShieldQuestion
} from 'lucide-react';

const ParentProfilePage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const { mutateAsync: updateProfile, isPending: updatingProfile } = useUpdateProfile();
    const { data: allSubjects } = useSubjects();
    const { mutateAsync: changePassword, isPending: changingPassword } = useProfilePasswordChange();
    const { mutateAsync: requestPhoneChange, isPending: requestingPhoneChange } = useRequestPhoneChange();
    const { mutateAsync: verifyPhoneChange, isPending: verifyingPhoneChange } = useVerifyPhoneChange();
    const { showNotification } = useNotificationStore();
    const { data: grades } = useGrades();
    const { mutateAsync: deleteAccount, isPending: deletingAccount } = useDeleteAccount();
    const logout = useAuthStore(state => state.logout);
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const isAdminEditing = !!id && (user?.role === Role.Admin);
    const targetUserId = id ? parseInt(id) : undefined;

    const { data: targetUser, isLoading: loadingTargetUser, updateMutation: adminUpdateProfile } = useUser(isAdminEditing ? targetUserId : undefined);

    const activeUser = isAdminEditing ? targetUser : user;
    const isUpdating = isAdminEditing ? adminUpdateProfile.isPending : updatingProfile;

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);

    // Username Check State
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [parentData, setParentData] = useState({
        username: activeUser?.username || '',
        firstName: activeUser?.first_name || '',
        lastName: activeUser?.last_name || '',
        email: activeUser?.email || '',
        phone: activeUser?.phone_number || '',
        location: activeUser?.location || '',
        studentGradeLevel: activeUser?.student_profile?.grade_level || '',
        subjects: activeUser?.subject?.map((s: any) => s.id) || [] as number[]
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [newPhone, setNewPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    useEffect(() => {
        if (activeUser) {
            setParentData({
                username: activeUser.username || '',
                firstName: activeUser.first_name || '',
                lastName: activeUser.last_name || '',
                email: activeUser.email || '',
                phone: activeUser.phone_number || '',
                location: activeUser.location || '',
                studentGradeLevel: activeUser.student_profile?.grade_level || '',
                subjects: activeUser.subject?.map((s: any) => s.id) || []
            });
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParentData(prev => ({ ...prev, [name]: value }));

        if (name === 'username') {
            checkUsername(value);
        }
    }
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const toggleSubject = (id: number) => {
        setParentData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(id)
                ? prev.subjects.filter(s => s !== id)
                : [...prev.subjects, id]
        }));
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
            showNotification("Phone number verified and updated!", "success");
            queryClient.invalidateQueries();
            setShowPhoneChangeModal(false);
            setNewPhone('');
            setVerificationCode('');
        } catch (err) {
            showNotification("Invalid verification code", "error");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("ARE YOU ABSOLUTELY SURE? This action is permanent and cannot be undone. All your data and wallet balance will be permanently deleted.")) {
            return;
        }

        try {
            await deleteAccount();
            showNotification("Account deleted successfully. We're sorry to see you go.", "info");
            logout();
            navigate('/');
        } catch (err) {
            showNotification("Error deleting account", "error");
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('first_name', parentData.firstName);
        formData.append('last_name', parentData.lastName);
        formData.append('email', parentData.email);
        formData.append('username', parentData.username);
        formData.append('location', parentData.location);
        if (parentData.studentGradeLevel) {
            formData.append('grade_level', parentData.studentGradeLevel.toString());
        }
        if (selectedPhoto) {
            formData.append('photo', selectedPhoto);
        }
        parentData.subjects.forEach(s => formData.append('subject', s.toString()));

        try {
            if (isAdminEditing) {
                await adminUpdateProfile.mutateAsync(formData);
            } else {
                await updateProfile(formData as any);
            }
            setIsEditing(false);
            showNotification("Profile updated successfully!", "success");
            queryClient.invalidateQueries();
        } catch (err) {
            console.error(err);
            showNotification("Error updating profile", "error");
        }
    }
    if (isAdminEditing && loadingTargetUser) return (
        <ProfileLayout userRole="admin" pageTitle="Admin Edit Profile">
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </ProfileLayout>
    );

    return (
        <ProfileLayout userRole={isAdminEditing ? "admin" : "parent"} pageTitle={isAdminEditing ? `Edit User: ${activeUser?.username}` : "Manage Profile"}>
            <div className="space-y-6 pb-20">
                {/* Header Profile Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <img
                                src={photoPreview || activeUser?.photo || `https://ui-avatars.com/api/?name=${parentData?.firstName}+${parentData?.lastName}&background=4C1D95&color=fff&size=128`}
                                alt={parentData.username}
                                className="w-24 h-24 rounded-full border-4 border-neutral-50 shadow-sm object-cover transition-transform group-hover:scale-105"
                            />
                            {isEditing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white hover:bg-primary-dark transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                <h2 className="text-2xl font-black text-neutral-900">{parentData?.firstName} {parentData?.lastName}</h2>
                                {activeUser?.is_phone_verified && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[8px] font-black border border-primary/10">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        VERIFIED
                                    </div>
                                )}
                            </div>
                            <p className="text-neutral-500 font-bold">@{parentData.username}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full border border-primary/10">
                                    {activeUser?.balance || 0} ETB
                                </div>
                                <div className="px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-black rounded-full border border-neutral-200">
                                    {activeUser?.student_profile?.grade_level_name || 'No Grade'} Student
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 px-6 py-2 text-xs font-black text-primary border-2 border-primary/20 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto md:mx-0"
                                >
                                    <UserIcon className="w-3.5 h-3.5" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-neutral-900">Personal Information</h3>
                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest leading-none mt-1">Basic contact and identity details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">First Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={parentData.firstName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 pl-12 border-2 rounded-2xl transition-all outline-none font-bold ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'}`}
                                    />
                                    <UserIcon className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={parentData.lastName}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 pl-12 border-2 rounded-2xl transition-all outline-none font-bold ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'}`}
                                    />
                                    <UserIcon className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={parentData.username}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 pl-12 pr-12 border-2 rounded-2xl transition-all outline-none font-bold ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'} ${isUsernameAvailable === false ? 'border-red-500 focus:border-red-500' : isUsernameAvailable === true ? 'border-green-500 focus:border-green-500' : ''}`}
                                    />
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-black transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`}>@</span>
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
                                    <p className="text-[10px] text-red-500 font-black ml-1 uppercase tracking-tight">This username is already taken</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={parentData.email}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 pl-12 border-2 rounded-2xl transition-all outline-none font-bold ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'}`}
                                    />
                                    <Mail className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Location</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={parentData.location}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full p-4 pl-12 border-2 rounded-2xl transition-all outline-none font-bold ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'}`}
                                    />
                                    <MapPin className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Student's Grade Level</label>
                                <div className="relative">
                                    <select
                                        name="studentGradeLevel"
                                        value={parentData.studentGradeLevel}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`w-full p-4 pl-12 appearance-none border-2 rounded-2xl transition-all outline-none font-bold cursor-pointer ${!isEditing ? 'bg-neutral-50 border-neutral-50 text-neutral-500' : 'border-neutral-100 focus:border-primary focus:ring-4 focus:ring-primary/5 bg-white'}`}
                                    >
                                        <option value="">Select Grade Level</option>
                                        {grades?.results?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </select>
                                    <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                    <UserIcon className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${!isEditing ? 'text-neutral-300' : 'text-neutral-400'}`} />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Student's Subjects of Interest</label>
                                <div className="pt-2">
                                    <SubjectSelector
                                        allSubjects={allSubjects?.results || []}
                                        selectedSubjectIds={parentData.subjects}
                                        onToggle={toggleSubject}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-neutral-50">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setParentData({
                                            username: user?.username || '',
                                            firstName: user?.first_name || '',
                                            lastName: user?.last_name || '',
                                            email: user?.email || '',
                                            phone: user?.phone_number || '',
                                            location: user?.location || '',
                                            studentGradeLevel: user?.student_profile?.grade_level || '',
                                            subjects: user?.subject?.map((s: any) => s.id) || []
                                        });
                                        setIsUsernameAvailable(null);
                                    }}
                                    className="px-6 py-3 text-xs font-black text-neutral-500 hover:text-neutral-700 bg-neutral-100 rounded-xl transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isUpdating || isUsernameAvailable === false}
                                    className="px-8 py-3 text-xs font-black text-white bg-primary rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all flex items-center space-x-2 disabled:opacity-50 uppercase tracking-widest"
                                >
                                    {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Security & Account */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
                        {/* Phone Verification Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                            <h3 className="text-lg font-black text-neutral-900 mb-6 flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-primary" />
                                Phone Update
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-1">Current Number</p>
                                    <p className="text-sm font-black text-neutral-900">{activeUser?.phone_number || 'Not verified'}</p>
                                    {activeUser?.is_phone_verified ? (
                                        <div className="inline-flex items-center mt-2 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[8px] font-black border border-green-100">
                                            <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                                            VERIFIED
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center mt-2 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[8px] font-black border border-amber-100">
                                            <AlertCircle className="w-2.5 h-2.5 mr-1" />
                                            NOT VERIFIED
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Register New Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+251 9..."
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        className="w-full p-4 text-sm font-bold border-2 border-neutral-50 bg-neutral-50 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all"
                                    />
                                    <button
                                        onClick={handlePhoneChangeRequest}
                                        disabled={requestingPhoneChange || !newPhone}
                                        className="w-full py-4 bg-neutral-900 text-white rounded-2xl text-[10px] font-black hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {requestingPhoneChange ? 'Sending Code...' : 'Request Update Code'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                            <button
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                                className="w-full p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors text-left"
                            >
                                <div className="flex items-center">
                                    <Lock className="w-5 h-5 mr-3 text-primary" />
                                    <div>
                                        <span className="font-black text-neutral-900 block">Security Settings</span>
                                        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Update your password</span>
                                    </div>
                                </div>
                                {showPasswordChange ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                            </button>

                            {showPasswordChange && (
                                <form onSubmit={handlePasswordChange} className="px-8 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                            className="w-full p-4 border-2 border-neutral-50 rounded-2xl focus:border-primary outline-none transition-all font-bold bg-neutral-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full p-4 border-2 border-neutral-50 rounded-2xl focus:border-primary outline-none transition-all font-bold bg-neutral-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full p-4 border-2 border-neutral-50 rounded-2xl focus:border-primary outline-none transition-all font-bold bg-neutral-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {changingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
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
                            <h3 className="text-xl font-black text-neutral-900 mb-2">Verify Your New Phone</h3>
                            <p className="text-neutral-500 text-sm font-medium mb-6">
                                We've sent a 6-digit verification code to <span className="font-black text-neutral-900">{newPhone}</span>.
                            </p>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full p-4 text-center text-3xl font-black tracking-[0.5em] border-2 border-neutral-100 rounded-3xl focus:border-primary outline-none transition-all"
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowPhoneChangeModal(false)}
                                        className="flex-1 py-4 bg-neutral-100 text-neutral-500 rounded-2xl font-black text-xs hover:bg-neutral-200 transition-colors uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePhoneVerify}
                                        disabled={verifyingPhoneChange || verificationCode.length !== 6}
                                        className="flex-2 py-4 px-3 bg-primary text-white rounded-2xl font-black text-xs hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 uppercase"
                                    >
                                        {verifyingPhoneChange ? 'Verifying...' : 'Verify & Close'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {!isAdminEditing && (
                <div className="mt-12 bg-red-50 p-8 rounded-[32px] border-2 border-red-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-red-900">Danger Zone</h3>
                                <p className="text-red-700/60 text-xs font-bold max-w-md">
                                    Deleting your account is irreversible. All your personal data and wallet balance will be permanently erased.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20 uppercase tracking-widest disabled:opacity-50"
                        >
                            {deletingAccount ? 'Deleting Account...' : 'Delete Permanently'}
                        </button>
                    </div>
                </div>
            )}
        </ProfileLayout>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Parent} secondaryRole={Role.Admin}>
            <ParentProfilePage />
        </RoleGuard>
    </AuthGuard>
);