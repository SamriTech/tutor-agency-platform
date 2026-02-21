import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const logoutRequest = () =>
    api.post("/api/auth/logout/");

export const useLogout = () => {
    const navigate = useNavigate();
    const logoutState = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            logoutState();
            navigate("/");
        },
    });
};
