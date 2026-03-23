import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { Subject } from "@/types";

export const useGrades = () => {
    return useQuery({
        queryKey: ['grades'],
        queryFn: async () => {
            const res = await api.get<{ results: Subject[] }>("/api/auth/subjects/?type=grade");
            return res.data;
        }
    });
};
