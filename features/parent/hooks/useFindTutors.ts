import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { User } from "@/types";

export interface TutorListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

export interface TutorFilters {
    search?: string;
    subject?: number | null;
    location?: string;
    role?: string;
    matched?: boolean;
    grade_level?: string;
}

export const useFindTutors = (filters: TutorFilters) => {
    return useQuery({
        queryKey: ["tutors", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.role) params.append("role", filters.role);
            if (filters.subject) params.append("subject", filters.subject.toString());
            if (filters.location) params.append("location__icontains", filters.location);
            if (filters.search) params.append("search", filters.search);
            if (filters.matched) params.append("matched", "true");
            if (filters.grade_level) params.append("grade_level", filters.grade_level);

            const res = await api.get<TutorListResponse>("/api/auth/users/", { params });
            return res.data;
        },
    });
};
