import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { User } from "../../../types";

export const getUser = (id: number) =>
    api.get<User>(`/api/auth/users/${id}/`);

export const updateUser = (id: number, data: FormData) =>
    api.patch<User>(`/api/auth/users/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const useUser = (id?: number) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await getUser(id);
            return res.data;
        },
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (data: FormData) => updateUser(id!, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user", id] });
            queryClient.invalidateQueries({ queryKey: ["admin_users"] });
        }
    });

    return { ...query, updateMutation: mutation };
};
