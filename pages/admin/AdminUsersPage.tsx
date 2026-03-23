import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Footer from '../../components/ui/Footer';
import { useAdminUsers, useUserAction } from '../../features/admin/hooks/useAdminVerifications';
import {
    Search,
    Filter,
    MoreVertical,
    Ban,
    Unlock,
    Key,
    CheckCircle,
    XCircle,
    Loader2,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Users
} from 'lucide-react';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';

const AdminUsersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tutor' | 'student'>('tutor');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');

    const { data: usersData, isLoading } = useAdminUsers({
        role: activeTab,
        search: search,
        is_active: statusFilter === 'all' ? undefined : statusFilter === 'active'
    });

    const userActionMutation = useUserAction();

    const handleAction = (id: number, action: 'ban' | 'unban' | 'reset_password') => {
        if (confirm(`Are you sure you want to ${action === 'reset_password' ? 'reset the password to 1234567890' : action} this user?`)) {
            userActionMutation.mutate({ id, action });
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">
            <AdminNavbar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">User Management</h1>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage platform participants and permissions</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-neutral-200 w-fit">
                        <button
                            onClick={() => setActiveTab('tutor')}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tutor' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Tutors
                        </button>
                        <button
                            onClick={() => setActiveTab('student')}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'student' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Parents
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'tutor' ? 'tutors' : 'parents'} by name, email or username...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-white border border-neutral-200 rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned Only</option>
                    </select>
                </div>

                {/* Users List */}
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Loading users...</p>
                    </div>
                ) : usersData?.results && usersData.results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {usersData.results.map((user) => (
                            <div key={user.id} className="bg-white rounded-[32px] border border-neutral-200 p-6 shadow-sm hover:shadow-xl hover:shadow-neutral-200/50 transition-all group overflow-hidden relative">
                                {!user.is_active && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-4 py-1 uppercase tracking-[0.2em] rounded-bl-xl z-10">BANNED</div>
                                )}

                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 overflow-hidden border border-neutral-100">
                                            {user.id_photo ? (
                                                <img src={user.id_photo} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-black">{user.first_name?.[0] || user.username[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-neutral-900 group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary/30">
                                                {user.first_name} {user.last_name}
                                            </h3>
                                            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-0.5">@{user.username}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                                        <Mail className="w-3.5 h-3.5 text-neutral-300" />
                                        <span>{user.email || 'No email provided'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium font-mono">
                                        <ShieldCheck className={`w-3.5 h-3.5 ${user.is_id_verified ? 'text-green-500' : 'text-neutral-300'}`} />
                                        <span>{user.is_id_verified ? 'Identity Verified' : 'Unverified Identity'}</span>
                                    </div>
                                </div>

                                <div className="flex border-t border-neutral-50 pt-6 gap-2">
                                    {user.is_active ? (
                                        <button
                                            onClick={() => handleAction(user.id, 'ban')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                                        >
                                            <Ban className="w-3 h-3" /> Ban
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(user.id, 'unban')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
                                        >
                                            <Unlock className="w-3 h-3" /> Unban
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction(user.id, 'reset_password')}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all shadow-sm"
                                    >
                                        <Key className="w-3 h-3" /> Reset Pwd
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 bg-white rounded-[48px] border-2 border-dashed border-neutral-200 text-center">
                        <Users className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-neutral-900 italic">No users found</h3>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-2">Try adjusting your filters or search query</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Admin}>
            <AdminUsersPage />
        </RoleGuard>
    </AuthGuard>
);
