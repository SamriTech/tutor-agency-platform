import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const useProfilePasswordChange = () => {
    return useMutation({
        mutationFn: (data: any) => api.post("/api/auth/profile/change-password/", data),
    });
};

export const useRequestPhoneChange = () => {
    return useMutation({
        mutationFn: (phone_number: string) => api.post("/api/auth/profile/request-phone-change/", { phone_number }),
    });
};

export const useVerifyPhoneChange = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (code: string) => api.post("/api/auth/profile/verify-phone-change/", { code }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        }
    });
};

export const checkUsernameAvailability = async (username: string) => {
    const res = await api.get<{ exists: boolean }>(`/api/auth/check-username/?username=${username}`);
    return res.data;
};

// Connection History hook moved to useConnectionHistory.ts
