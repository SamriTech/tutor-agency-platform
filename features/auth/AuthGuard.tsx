import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";


export const AuthGuard = ({ children }: { children: ReactNode }) => {

  const { isInitialized, isAuthenticated } = useAuthStore();


  if ( !isInitialized) {
    return <div>Loading your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};