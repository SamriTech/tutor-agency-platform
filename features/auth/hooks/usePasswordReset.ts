import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const resetPasswordRequest = (phone: string) =>
    api.post("/api/auth/password/reset/", { phone });

export const verifyResetRequest = (data: { code: string }) =>
    api.post("/api/auth/password/reset/verify/", data);

export const changePasswordRequest = (data: { token: string; password: string; confirm_password: string }) =>
    api.post("/api/auth/changepassword/", data);

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (email: string) => resetPasswordRequest(email),
    });
};

export const useVerifyReset = () => {
    return useMutation({
        mutationFn: (data: any) => verifyResetRequest(data),
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: any) => changePasswordRequest(data),
    });
};
