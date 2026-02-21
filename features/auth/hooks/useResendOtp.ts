import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export const resendOtpRequest = () =>
    api.post("/api/auth/resend-otp/");

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtpRequest,
    });
};
