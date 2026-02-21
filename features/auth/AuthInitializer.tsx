import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api/axios"; // axios instance
import { useResendOtp } from "./hooks";
const AuthInitializer = () => {
  const { setUser } = useAuthStore();
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const resendMutation = useResendOtp();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("api/auth/user/");
        const user = res.data;
        setUser(user);

        // Define pages that are part of the auth flow and shouldn't trigger redirection
        const authFlowPages = ["/verify-phone", "/finish-signup", "/login", "/register"];

        if (user && !user.is_phone_verified && !authFlowPages.includes(location.pathname)) {
          resendMutation.mutate()
          navigate('/verify-phone');
        }

      } catch (error) {
        logout(); // important → marks initialized true
      }
    };

    initAuth();
  }, [setUser, logout, navigate, location.pathname]);

  return null;
};

export default AuthInitializer;