import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface Review {
    id: number;
    reviewer_name: string;
    reviewee: number;
    rating: number;
    comment: string;
    created_at: string;
}

export const useTutorReviews = () => {
    return useQuery({
        queryKey: ["tutor_reviews"],
        queryFn: async () => {
            const res = await api.get<{ results: Review[] }>("/api/auth/tutor/reviews/");
            return res.data;
        },
    });
};
