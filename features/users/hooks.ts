import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    // Handle both JSON and FormData (for photos)
    mutationFn: async (data: FormData | Partial<User>) => {
      const response = await api.patch("/api/auth/users/me/update/", data, {
        headers: {
          "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
        },
      });
      return response.data;
    },
    // OPTIMISTIC UPDATE LOGIC
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["user-profile"] });
      const previousUser = useAuthStore.getState().user;

      // If it's FormData (photo), we can't easily preview it without URL.createObjectURL
      // For simple fields, we update Zustand immediately
      if (!(newData instanceof FormData)) {
        useAuthStore.getState().updateUser(newData);
      }

      return { previousUser };
    },
    onError: (err, newData, context) => {
      // Rollback if server fails
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser); // Final sync with server data
    },
  });
};