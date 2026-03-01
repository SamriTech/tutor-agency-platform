import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  updateUser: (changes: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isInitialized: true,
        }),

      updateUser: (changes) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...changes }
            : null,
          isAuthenticated: !!state.user,
          isInitialized: true,
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
        }),
    }),
    {
      name: "auth-storage", // stored in localStorage
    }
  )
);