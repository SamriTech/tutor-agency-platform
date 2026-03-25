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
    grade?: number | null;
    grade_level?: string | null;
    min_rate?: string;
    max_rate?: string;
    location?: string;
    role?: string;
    matched?: boolean;
}

export const useFindTutors = (filters: TutorFilters) => {
    return useQuery({
        queryKey: ["tutors", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.role) params.append("role", filters.role);
            if (filters.subject) params.append("subject", filters.subject.toString());
            if (filters.grade) params.append("grade", filters.grade.toString());
            if (filters.min_rate) params.append("min_rate", filters.min_rate);
            if (filters.max_rate) params.append("max_rate", filters.max_rate);
            if (filters.location) params.append("location__icontains", filters.location);
            if (filters.search) params.append("search", filters.search);
            if (filters.matched) params.append("matched", "true");

            const res = await api.get<TutorListResponse>("/api/auth/users/", { params });
            return res.data;
        },
    });
};
