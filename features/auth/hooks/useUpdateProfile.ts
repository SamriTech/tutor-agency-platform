import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const updateProfileRequest = (data: FormData) =>
    api.post("/api/auth/update-profile/", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => updateProfileRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }
    });
};
