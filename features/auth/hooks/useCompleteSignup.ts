import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { CompleteSignupPayload } from "../types";

export const completeSignupRequest = (data: CompleteSignupPayload | FormData) =>
    api.post("/api/auth/finish-signup/", data, {
        headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });

export const useCompleteSignup = () => {
    return useMutation({
        mutationFn: (data: CompleteSignupPayload | FormData) => completeSignupRequest(data),
    });
};
