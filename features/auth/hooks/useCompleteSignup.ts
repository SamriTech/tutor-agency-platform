import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { CompleteSignupPayload } from "../types";

export const completeSignupRequest = (data: CompleteSignupPayload) =>
    api.post("/api/auth/finish-signup/", data);

export const useCompleteSignup = () => {
    return useMutation({
        mutationFn: (data: CompleteSignupPayload) => completeSignupRequest(data),
    });
};
