import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface Qualification {
    id: number;
    title: string;
    type: 'education' | 'award' | 'certificate' | 'work_experience';
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    pdf?: string;
    images?: { id: number; image: string }[];
}

export const useQualifications = () => {
    return useQuery({
        queryKey: ["qualifications"],
        queryFn: async () => {
            const res = await api.get<{ results: Qualification[] }>("/api/auth/users/qualifications/");
            return res.data;
        },
    });
};

export const useAddQualification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post("/api/auth/users/qualifications/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qualifications"] });
        }
    });
};

export const useDeleteQualification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/auth/users/qualifications/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["qualifications"] });
        }
    });
};
