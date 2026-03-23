import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { QualificationType, QualificationStatus } from "@/types";

export interface AdminUserVerification {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    id_photo: string | null;
    is_id_verified: boolean;
    is_active: boolean;
    role: string;
}

export interface AdminQualificationImage {
    id: number;
    image: string;
}

export interface AdminQualificationVerification {
    id: number;
    tutor: number;
    username: string;
    title: string;
    type: QualificationType;
    status: QualificationStatus;
    description: string | null;
    link: string | null;
    pdf: string | null;
    word_doc: string | null;
    images: AdminQualificationImage[];
}

export const usePendingUserVerifications = () => {
    return useQuery({
        queryKey: ['admin', 'verifications', 'users'],
        queryFn: async () => {
            const res = await api.get<{ results: AdminUserVerification[] }>("/api/manager/verifications/users/");
            return res.data;
        }
    });
};

export const usePendingQualificationVerifications = () => {
    return useQuery({
        queryKey: ['admin', 'verifications', 'qualifications'],
        queryFn: async () => {
            const res = await api.get<AdminQualificationVerification[]>("/api/manager/verifications/qualifications/");
            return res.data;
        }
    });
};

export const useVerifyUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, is_id_verified, status }: { id: number; is_id_verified: boolean; status?: string }) => {
            const res = await api.patch(`/api/manager/verifications/users/${id}/`, { is_id_verified, status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });
};

export const useAdminUsers = (filters: { role?: string; is_active?: boolean; search?: string }) => {
    return useQuery({
        queryKey: ['admin', 'users', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.role) params.append('role', filters.role);
            if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
            if (filters.search) params.append('search', filters.search);
            const res = await api.get<{ results: AdminUserVerification[] }>("/api/manager/users/", { params });
            return res.data;
        }
    });
};

export const useUserAction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, action }: { id: number; action: 'ban' | 'unban' | 'reset_password' }) => {
            const res = await api.post(`/api/manager/users/${id}/action/`, { action });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        }
    });
};

export const useAllQualifications = (filters: { status?: string; search?: string }) => {
    return useQuery({
        queryKey: ['admin', 'qualifications', 'all', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            const res = await api.get<{ results: AdminQualificationVerification[] }>("/api/manager/qualifications/", { params });
            return res.data;
        }
    });
};

export const useVerifyQualification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
            const res = await api.patch(`/api/manager/verifications/qualifications/${id}/`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'verifications', 'qualifications'] });
        }
    });
};
