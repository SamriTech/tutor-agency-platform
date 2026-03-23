import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { VerifyOtpPayload } from "../types";
import { useQueryClient } from "@tanstack/react-query";
export const verifyOtpRequest = (data: VerifyOtpPayload) =>
    api.post("/api/auth/verifyotp", data);

export const useVerifyOtp = () => {
    const query = useQueryClient()
    return useMutation({
        mutationFn: (data: VerifyOtpPayload) => verifyOtpRequest(data),
        onSuccess: async (suc) => {
            await query.invalidateQueries({ queryKey: ['currentUser'] })
        }
    });
};
