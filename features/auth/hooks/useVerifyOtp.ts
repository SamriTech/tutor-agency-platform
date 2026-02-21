import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { VerifyOtpPayload } from "../types";

export const verifyOtpRequest = (data: VerifyOtpPayload) =>
    api.post("/api/auth/verifyotp", data);

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: (data: VerifyOtpPayload) => verifyOtpRequest(data),
    });
};
