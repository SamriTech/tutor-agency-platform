import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const googleLoginRequest = (accessToken: string) =>
    api.post("/api/auth/google/", { access_token: accessToken });

export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: (accessToken: string) => googleLoginRequest(accessToken),
    });
};
