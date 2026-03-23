import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export interface Subject {
    id: number;
    name: string;
}

export const useSubjects = (grade: string = undefined) => {
    return useQuery({
        queryKey: ["subjects", grade],
        queryFn: async () => {
            let res;
            if (grade == undefined) {
                res = await api.get<{ results: Subject[] }>("/api/auth/subjects/");
            } else if (grade == "grade") {
                res = await api.get<{ results: Subject[] }>(`/api/auth/subjects/?type=grade`);
            } else {
                res = await api.get<{ results: Subject[] }>(`/api/auth/subjects/?type=All`);
            }
            return res.data;
        },
    });
};
