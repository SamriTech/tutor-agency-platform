import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface ReviewData {
    reviewee: number;
    rating: number;
    comment: string;
}

export const useAddReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ReviewData) => {
            const res = await api.post("/api/auth/reviews/", data);
            return res.data;
        },
        onSuccess: () => {
            // Invalidate queries that might depend on reviews or tutor profiles
            queryClient.invalidateQueries({ queryKey: ["tutor-profile"] });
            queryClient.invalidateQueries({ queryKey: ["tutors"] });
        },
    });
};
