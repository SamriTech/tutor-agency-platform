import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { AuthGuard } from '../../features/auth/AuthGuard';
import { RoleGuard } from '../../features/auth/RoleGuard';
import { Role } from '../../types';
import { useParentTutoringRequests, useUpdateBooking, useCancelBooking, TutoringRequest, useAddReview } from '../../features/auth/hooks';
import {
    Calendar,
    Clock,
    User,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    ChevronRight,
    SearchX,
    MessageSquare,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Star
} from 'lucide-react';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorName: string;
    tutorId: number;
    initialRating?: number | null;
    initialComment?: string | null;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, tutorName, tutorId, initialRating, initialComment }) => {
    const [rating, setRating] = useState(initialRating || 5);
    const [comment, setComment] = useState(initialComment || '');
    const addReviewMutation = useAddReview();

    useEffect(() => {
        if (isOpen) {
            setRating(initialRating || 5);
            setComment(initialComment || '');
        }
    }, [isOpen, initialRating, initialComment]);

    const handleSubmit = () => {
        addReviewMutation.mutate({
            reviewee: tutorId,
            rating,
            comment
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <h2 className="text-3xl font-black text-neutral-900 mb-2">Rate {tutorName}</h2>
                    <p className="text-neutral-500 font-medium mb-8">How was your learning experience? Your feedback helps us maintain high quality.</p>

                    <div className="flex justify-center gap-2 mb-10">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="p-2 transition-transform hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    className={`w-12 h-12 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-200'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Write a short review (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g., 'Very patient and clear explanations...'"
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none min-h-[120px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors bg-neutral-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={addReviewMutation.isPending}
                            className="px-6 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {addReviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Rating"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyBookingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editDescription, setEditDescription] = useState('');
    const [ratingModal, setRatingModal] = useState<{
        isOpen: boolean;
        tutorId: number;
        tutorName: string;
        initialRating?: number | null;
        initialComment?: string | null;
    }>({
        isOpen: false,
        tutorId: 0,
        tutorName: '',
        initialRating: null,
        initialComment: null
    });

    const { data: requests, isLoading } = useParentTutoringRequests();
    const updateMutation = useUpdateBooking();
    const cancelMutation = useCancelBooking();

    const filteredRequests = useMemo(() => {
        if (!requests) return [];
        return requests.filter(req => {
            const matchesTab = activeTab === 'active' ? req.is_active : !req.is_active;
            const matchesSearch = req.tutor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.subject_name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [requests, activeTab, searchQuery]);

    const handleEdit = (req: TutoringRequest) => {
        setIsEditing(req.id);
        setEditDescription(req.description);
    };

    const handleSaveEdit = (id: number) => {
        updateMutation.mutate({ id, description: editDescription }, {
            onSuccess: () => setIsEditing(null)
        });
    };

    const handleCancel = (id: number) => {
        if (window.confirm("Are you sure you want to cancel this booking request?")) {
            cancelMutation.mutate(id);
        }
    };

    return (
        <div className="bg-neutral-50 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Manage Bookings</h1>
                            <p className="text-neutral-500 font-medium">Track your requests, coordinate with tutors, and manage your sessions.</p>
                        </div>

                        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                            {/* Search Bar */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by tutor or subject..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 pr-6 py-4 bg-white border border-neutral-200 rounded-2xl text-sm font-bold w-full md:w-72 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                                />
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-neutral-100 p-1 rounded-2xl">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setActiveTab('inactive')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inactive' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                >
                                    Past
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Loading bookings...</p>
                        </div>
                    ) : filteredRequests.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredRequests.map(request => (
                                <div key={request.id} className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-900/5 transition-all group overflow-hidden relative">
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        <div className="flex gap-6">
                                            {/* Tutor Avatar */}
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-neutral-100 border-4 border-white shadow-md relative z-10">
                                                    {request.tutor_photo ? (
                                                        <img src={process.env.VITE_API_URL + request.tutor_photo} alt={request.tutor_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User className="w-8 h-8 text-neutral-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl flex items-center justify-center border-2 border-white z-20 shadow-sm ${request.seen ? 'bg-primary' : 'bg-neutral-900'}`}>
                                                    {request.seen ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-black tracking-widest rounded-full">
                                                        {request.subject_name.toUpperCase()}
                                                    </span>
                                                    <span className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                                                        {new Date(request.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-neutral-900">{request.tutor_name}</h3>
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${request.status === 'refused' ? 'text-red-500' : request.seen ? 'text-primary' : 'text-neutral-400'}`}>
                                                        {request.status === 'refused' ? (
                                                            <><XCircle className="w-3.5 h-3.5" /> Canceled by Tutor</>
                                                        ) : request.seen ? (
                                                            <><CheckCircle2 className="w-3.5 h-3.5" /> Seen by Tutor</>
                                                        ) : (
                                                            <><AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Waiting for Review</>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 min-w-[180px]">
                                            {activeTab === 'active' ? (
                                                <>
                                                    {request.seen && (
                                                        <button
                                                            onClick={() => setRatingModal({
                                                                isOpen: true,
                                                                tutorId: request.tutor,
                                                                tutorName: request.tutor_name,
                                                                initialRating: request.review_rating,
                                                                initialComment: request.review_comment
                                                            })}
                                                            className={`w-full px-6 py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 shadow-lg mb-2 ${request.has_review ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none' : 'bg-yellow-400 text-neutral-900 hover:bg-yellow-500 shadow-yellow-400/20'
                                                                }`}
                                                        >
                                                            {request.has_review ? <CheckCircle2 className="w-4 h-4" /> : <Star className="w-4 h-4 fill-current" />}
                                                            {request.has_review ? "Update Rating" : "Rate Tutor"}
                                                        </button>
                                                    )}
                                                    {request.seen ? (
                                                        <p className="text-[10px] text-neutral-400 font-bold text-center italic uppercase tracking-widest px-4">
                                                            Request Locked from Edits
                                                        </p>
                                                    ) : (
                                                        <>
                                                            {isEditing === request.id ? (
                                                                <button
                                                                    onClick={() => handleSaveEdit(request.id)}
                                                                    disabled={updateMutation.isPending}
                                                                    className="w-full px-6 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                                                                >
                                                                    {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                                                    Save Changes
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleEdit(request)}
                                                                    className="w-full px-6 py-4 bg-white border-2 border-neutral-900 text-neutral-900 rounded-2xl font-black text-xs hover:bg-neutral-50 transition-all flex items-center justify-center gap-3"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                    Edit Request
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleCancel(request.id)}
                                                                disabled={cancelMutation.isPending}
                                                                className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-3"
                                                            >
                                                                {cancelMutation.isPending && cancelMutation.variables === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                                Cancel Request
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {request.status === 'refused' ? (
                                                        <button
                                                            onClick={() => handleCancel(request.id)}
                                                            disabled={cancelMutation.isPending}
                                                            className="w-full px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-3"
                                                        >
                                                            {cancelMutation.isPending && cancelMutation.variables === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                            Delete Record
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setRatingModal({
                                                                    isOpen: true,
                                                                    tutorId: request.tutor,
                                                                    tutorName: request.tutor_name,
                                                                    initialRating: request.review_rating,
                                                                    initialComment: request.review_comment
                                                                })}
                                                                className={`w-full px-6 py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 shadow-lg ${request.has_review ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none' : 'bg-yellow-400 text-neutral-900 hover:bg-yellow-500 shadow-yellow-400/20'
                                                                    }`}
                                                            >
                                                                {request.has_review ? <CheckCircle2 className="w-4 h-4" /> : <Star className="w-4 h-4 fill-current" />}
                                                                {request.has_review ? "Update Rating" : "Rate Tutor"}
                                                            </button>
                                                            <p className="text-[10px] text-neutral-400 font-bold text-center italic uppercase tracking-widest px-4">
                                                                Past Booking Record
                                                            </p>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description / Edit Box */}
                                    <div className="mt-8 p-6 bg-neutral-50 rounded-[28px] border border-neutral-100 group-hover:bg-white transition-colors relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />

                                        {isEditing === request.id ? (
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Update Requirement Description</label>
                                                <textarea
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    rows={4}
                                                    className="w-full bg-white border border-neutral-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={() => setIsEditing(null)}
                                                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                                                    >
                                                        Cancel Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Your Message
                                                </h4>
                                                <p className="text-neutral-600 text-sm leading-relaxed font-medium">
                                                    {request.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] p-20 border border-neutral-100 shadow-sm text-center space-y-6">
                            <div className="w-24 h-24 bg-neutral-50 rounded-[32px] flex items-center justify-center mx-auto">
                                <SearchX className="w-10 h-10 text-neutral-300" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-neutral-900">No bookings found</h3>
                                <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                                    {searchQuery ? `We couldn't find any bookings matching "${searchQuery}".` : `You don't have any ${activeTab} bookings at the moment.`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <RatingModal
                isOpen={ratingModal.isOpen}
                onClose={() => setRatingModal(prev => ({ ...prev, isOpen: false }))}
                tutorId={ratingModal.tutorId}
                tutorName={ratingModal.tutorName}
                initialRating={ratingModal.initialRating}
                initialComment={ratingModal.initialComment}
            />

            <Footer />
        </div>
    );
};

export default () => (
    <AuthGuard>
        <RoleGuard role={Role.Parent}>
            <MyBookingsPage />
        </RoleGuard>
    </AuthGuard>
);
