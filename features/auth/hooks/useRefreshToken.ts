import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const refreshTokenRequest = () =>
    api.post("/api/auth/token/refresh/");

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: refreshTokenRequest,
    });
};
