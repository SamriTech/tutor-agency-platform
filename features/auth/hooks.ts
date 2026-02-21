import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest, getCurrentUser, logoutRequest } from "./api";
import { useAuthStore } from "@/store/authStore";
import { LoginPayload } from "./types";

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => loginRequest(data),
    onSuccess: (res) => {
      setUser(res.data.user);
      // Clears old cache data from previous sessions
      queryClient.invalidateQueries();
    },
  });
};

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
    retry: false, // Don't spam the server if the user is just a guest
    staleTime: 1000 * 60 * 5, // Keep session valid in cache for 5 mins
  });
};

export const useLogout = () => {
  const logoutState = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logoutState();
      queryClient.clear(); // Nuclear option: remove everything from cache
      window.location.href = "/login";
    },
  });
};