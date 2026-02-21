import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/authStore";
import { RegisterPayload } from "../types";

export const registerRequest = (data: RegisterPayload) =>
    api.post("/api/auth/registration/", data);

export const useRegister = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: (data: RegisterPayload) => registerRequest(data),
        onSuccess: (res) => {
            if (res.data.user) {
                setUser(res.data.user);
            }
        },
    });
};
