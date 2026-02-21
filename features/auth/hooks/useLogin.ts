import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/authStore";
import { LoginPayload } from "../types";

export const loginRequest = (data: LoginPayload) =>
    api.post("/api/auth/login/", data);

export const useLogin = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: (data: LoginPayload) => loginRequest(data),
        onSuccess: (res) => {
            setUser(res.data.user);
        },
    });
};
