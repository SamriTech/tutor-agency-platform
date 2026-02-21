import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/authStore";
import { User } from "../../../types";

export const getCurrentUser = () =>
    api.get<User>("/api/auth/user/");

export const useCurrentUser = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data);
                return res.data;
            } catch (err) {
                setUser(null);
                throw err;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
};
