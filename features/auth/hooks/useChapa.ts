import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useNotificationStore } from "@/store/notificationStore";

export interface DepositRequest {
    amount: number;
}

export interface DepositResponse {
    status: string;
    checkout_url: string;
    tx_ref: string;
}

export const useChapaDeposit = () => {
    const showNotification = useNotificationStore(state => state.showNotification);

    return useMutation({
        mutationFn: async (data: DepositRequest) => {
            const res = await api.post<DepositResponse>("/api/auth/wallet/deposit/", data);
            return res.data;
        },
        onSuccess: (data) => {
            // Redirect to Chapa checkout
            window.location.href = data.checkout_url;
        },
        onError: (error: any) => {
            showNotification(
                error.response?.data?.message || "Failed to initialize deposit. Please try again.",
                "error"
            );
        }
    });
};

export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: async (txRef: string) => {
            const res = await api.get(`/api/auth/wallet/verify/${txRef}/`);
            return res.data;
        }
    });
};
