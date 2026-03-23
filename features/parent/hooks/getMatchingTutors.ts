import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { User } from "@/types";

export interface TutorListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

export const getMatchingTutors = () => {
    return useQuery({
        queryKey: ["defualt_tutors"],
        queryFn: async () => {
            const res = await api.get<TutorListResponse>("/api/auth/users/", { params: { "matched": true } });
            return res.data;
        },
    });
};
