import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useNotificationStore } from "@/store/notificationStore";

export interface TutoringRequest {
    id: number;
    parent: number;
    tutor: number;
    description: string;
    created_at: string;
    is_active: boolean;
    parent_name: string;
    parent_photo: string | null;
    is_unlocked: boolean;
    subject_name: string;
    seen: boolean;
    tutor_photo: string | null;
    has_review: boolean;
    tutor_name: string;
    parent_phone?: string;
    parent_email?: string;
    location?: string;
    grade?: string;
    review_rating: number | null;
    review_comment: string | null;
}

export interface TutoringRequestsResponse {
    tutor_requests: TutoringRequest[];
}

export const useTutoringRequests = () => {
    return useQuery({
        queryKey: ['tutorRequests'],
        queryFn: async () => {
            const res = await api.get<TutoringRequestsResponse>("/api/auth/tutor-requests/");
            return res.data;
        }
    });
};

export const useTutoringRequestDetail = (requestId: number | string | undefined) => {
    return useQuery({
        queryKey: ['tutorRequestDetail', requestId],
        queryFn: async () => {
            if (!requestId) return null;
            const res = await api.get<{ tutor_request: TutoringRequest }>(`/api/auth/tutor-requests/${requestId}/`);
            return res.data.tutor_request;
        },
        enabled: !!requestId
    });
};

export const useCreateTutoringRequest = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async ({ tutorId, description }: { tutorId: number | string, description?: string }) => {
            const res = await api.post(`/api/auth/tutor-requests/${tutorId}/create/`, { description });
            return res.data;
        },
        onSuccess: () => {
            showNotification("Tutoring request sent successfully!", "success");
            queryClient.invalidateQueries({ queryKey: ['tutorRequests'] });
            queryClient.invalidateQueries({ queryKey: ['parentRequests'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error sending request";
            showNotification(message, "error");
        }
    });
};

export const useUnlockLead = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (requestId: number) => {
            const res = await api.post(`/api/auth/unlock-lead/${requestId}/`);
            return res.data;
        },
        onSuccess: () => {
            showNotification("Lead unlocked successfully!", "success");
            queryClient.invalidateQueries({ queryKey: ['tutorRequests'] });
            queryClient.invalidateQueries({ queryKey: ['connectionHistory'] });
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error unlocking lead";
            showNotification(message, "error");
        }
    });
};

export const useParentTutoringRequests = () => {
    return useQuery({
        queryKey: ['parentRequests'],
        queryFn: async () => {
            const res = await api.get<{ requests: TutoringRequest[] }>('/api/auth/parent-requests/');
            return res.data.requests;
        }
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async ({ id, description }: { id: number | string, description: string }) => {
            const res = await api.patch(`/api/auth/parent-requests/${id}/`, { description });
            return res.data;
        },
        onSuccess: () => {
            showNotification("Booking updated successfully!", "success");
            queryClient.invalidateQueries({ queryKey: ['parentRequests'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error updating booking";
            showNotification(message, "error");
        }
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();
    const { showNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.delete(`/api/auth/parent-requests/${id}/`);
            return res.data;
        },
        onSuccess: () => {
            showNotification("Booking canceled successfully!", "success");
            queryClient.invalidateQueries({ queryKey: ['parentRequests'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error canceling booking";
            showNotification(message, "error");
        }
    });
};
