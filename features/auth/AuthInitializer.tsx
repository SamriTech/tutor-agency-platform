import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api/axios"; // axios instance
import { useResendOtp } from "./hooks";


const authFlowPages = ["/verify-phone", "/finish-signup", "/login", "/register"];


const AuthInitializer = () => {
  const { setUser, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/api/auth/user/");
        const user = res.data;
        console.log("test", user)
        setUser(user);
      } catch (error) {
        logout();
      }
    };
    if (!user) {
      initAuth();
    }
    if (user) {
      if (!authFlowPages.includes(location.pathname)) {
        const isProfileComplete = user.phone_number && (
          (user.role === 'tutor' && user.tutor_profile?.bio) ||
          (user.role === 'student' && user.student_profile?.grade_level)
        );

        if (!isProfileComplete) {
          navigate(`/finish-signup?path=${location.pathname}`);
        } else if (!user?.is_phone_verified) {
          navigate(`/verify-phone?path=${location.pathname}`);
        }
      }
    }
  }, [setUser, logout, navigate, location.pathname]);
  return null;
};

export default AuthInitializer;