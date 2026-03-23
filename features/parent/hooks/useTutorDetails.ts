import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { User } from '@/types';

export const useTutorDetails = (id: string | number | undefined) => {
    return useQuery({
        queryKey: ['tutor', id],
        queryFn: async () => {
            if (!id) return null;
            const res = await api.get<User>(`/api/auth/users/${id}/`);
            return res.data;
        },
        enabled: !!id,
    });
};
