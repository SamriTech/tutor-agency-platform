import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api/axios";
import { Expertise } from "../../../types";

export const useExpertise = () => {
    return useQuery({
        queryKey: ['expertise'],
        queryFn: async () => {
            const res = await api.get<{ results: Expertise[] }>("/api/auth/expertise/");
            return res.data;
        }
    });
};

export const useCreateExpertise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            const res = await api.post<Expertise>("/api/auth/expertise/", { name });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expertise'] });
        }
    });
};
