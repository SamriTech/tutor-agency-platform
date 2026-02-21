import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import {api} from "@/lib/api/axios"; // axios instance

const AuthInitializer = () => {

  const setUser = useAuthStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {

    const initAuth = async () => {
      try {
        const res = await api.get("/auth/me");

        setUser(res.data.user);

      } catch (error) {

        logout(); // important → marks initialized true

      }
    };

    initAuth();

  }, []);

  return null;
};

export default AuthInitializer;