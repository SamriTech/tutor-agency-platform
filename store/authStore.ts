import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user, 
    isInitialized: true 
  }),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    isInitialized: true 
  }),
}));