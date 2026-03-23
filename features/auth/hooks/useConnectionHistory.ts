import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface ConnectionTransaction {
    id: number;
    amount: number;
    transaction_type: 'buy' | 'usage';
    created_at: string;
}

export interface ConnectionHistoryResponse {
    connections: number;
    history: ConnectionTransaction[];
}

export const useConnectionHistory = () => {
    return useQuery({
        queryKey: ['connectionHistory'],
        queryFn: async () => {
            const res = await api.get<ConnectionHistoryResponse>("/api/auth/profile/connections/");
            return res.data;
        }
    });
};
