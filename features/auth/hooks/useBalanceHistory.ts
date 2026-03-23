import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { Transaction } from "@/types";

export interface BalanceHistoryResponse {
    balance: string;
    transactions: Transaction[];
}

export const useBalanceHistory = () => {
    return useQuery({
        queryKey: ['balanceHistory'],
        queryFn: async () => {
            const res = await api.get<BalanceHistoryResponse>("/api/auth/wallet/");
            return res.data;
        }
    });
};
