import React, { useState } from 'react';
import AdminNavbar from '../../components/admin/AdminNavbar';
import Footer from '../../components/ui/Footer';
import { useAllQualifications, useVerifyQualification } from '../../features/admin/hooks/useAdminVerifications';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Award,
    ExternalLink,
    FileText,
    User,
    Loader2,
    Eye,
    Clock,
    AlertCircle
} from 'lucide-react';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';

const AdminQualificationsPage: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data: qualsData, isLoading } = useAllQualifications({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search
    });

    const verifyMutation = useVerifyQualification();

    const handleVerify = (id: number, status: 'approved' | 'rejected') => {
        if (confirm(`Are you sure you want to set this qualification as ${status}?`)) {
            verifyMutation.mutate({ id, status });
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen font-sans">
            <AdminNavbar />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Qualification Moderation</h1>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-1">Review and verify tutor academic and professional records</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by qualification title or tutor username..."
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
                        <option value="all">All Records</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Grid of Qualification Cards */}
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Loading records...</p>
                    </div>
                ) : qualsData?.results && qualsData.results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {qualsData.results.map((q) => (
                            <div key={q.id} className="bg-white rounded-[40px] border border-neutral-200 p-8 shadow-sm hover:shadow-2xl hover:shadow-neutral-200/40 transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(q.status)}`}>
                                                {q.status}
                                            </span>
                                            <span className="bg-neutral-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] italic">
                                                @{q.username}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-neutral-900 mt-2">{q.title}</h3>
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <Award className="w-3.5 h-3.5" />
                                            <span className="text-xs font-bold uppercase tracking-widest">{q.type}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Always Available */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerify(q.id, 'approved')}
                                            disabled={q.status === 'approved'}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${q.status === 'approved'
                                                    ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-500 hover:text-white group'
                                                }`}
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => handleVerify(q.id, 'rejected')}
                                            disabled={q.status === 'rejected'}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${q.status === 'rejected'
                                                    ? 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white group'
                                                }`}
                                            title="Reject"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-neutral-50/50 rounded-2xl p-6 mb-8 flex-1 border border-neutral-100/50">
                                    <p className="text-sm text-neutral-600 font-medium leading-relaxed italic">
                                        "{q.description || 'No description provided.'}"
                                    </p>
                                </div>

                                {/* Media Attachments */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Supporting Documents</h4>
                                        <span className="text-[10px] font-bold text-neutral-300">ID: {q.id}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {q.images.map(img => (
                                            <div key={img.id} className="w-20 h-20 bg-neutral-100 rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-sm flex-shrink-0" onClick={() => setPreviewImage(img.image)}>
                                                <img src={img.image} alt="Evidence" className="w-full h-full object-cover rounded-xl" />
                                            </div>
                                        ))}

                                        {q.pdf && (
                                            <a href={q.pdf} target="_blank" rel="noreferrer" className="w-20 h-20 bg-white border border-neutral-200 text-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm flex-shrink-0">
                                                <FileText className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
                                                <span className="text-[8px] font-black uppercase">PDF</span>
                                            </a>
                                        )}

                                        {q.word_doc && (
                                            <a href={q.word_doc} target="_blank" rel="noreferrer" className="w-20 h-20 bg-white border border-neutral-200 text-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm flex-shrink-0">
                                                <AlertCircle className="w-5 h-5 text-blue-500 group-hover:text-white transition-colors" />
                                                <span className="text-[8px] font-black uppercase">DOCX</span>
                                            </a>
                                        )}

                                        {q.link && (
                                            <a href={q.link} target="_blank" rel="noreferrer" className="w-20 h-20 bg-white border border-neutral-200 text-neutral-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm flex-shrink-0">
                                                <ExternalLink className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                                <span className="text-[8px] font-black uppercase">LINK</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 bg-white rounded-[48px] border-2 border-dashed border-neutral-200 text-center">
                        <Award className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-neutral-900 italic">No records in this view</h3>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] mt-2">All caught up or try different filters</p>
                    </div>
                )}
            </main>

            {/* Preview Overlay */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-neutral-950/95 backdrop-blur-xl flex items-center justify-center p-10 onClick={() => setPreviewImage(null)} cursor-zoom-out">
                    <button className="absolute top-10 right-10 text-white hover:text-primary transition-colors">
                        <XCircle className="w-10 h-10" />
                    </button>
                    <img
                        src={previewImage}
                        alt="Evidence Preview"
                        className="max-w-full max-h-full rounded-2xl shadow-2xl animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Admin}>
            <AdminQualificationsPage />
        </RoleGuard>
    </AuthGuard>
);
