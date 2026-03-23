import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface Availability {
    id: number;
    day_of_week: number;
    day_name: string;
    start_time: string;
    end_time: string;
}

export const useAvailability = () => {
    return useQuery({
        queryKey: ["availability"],
        queryFn: async () => {
            const res = await api.get<{ results: Availability[] }>("/api/auth/users/availabilities/");
            return res.data;
        },
    });
};

export const useAddAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { day_of_week: number; start_time: string; end_time: string }) => {
            const res = await api.post("/api/auth/users/availabilities/", data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability"] });
        }
    });
};

export const useDeleteAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/api/auth/users/availabilities/${id}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability"] });
        }
    });
};
