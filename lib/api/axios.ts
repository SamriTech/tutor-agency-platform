import axios from "axios";

export const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. If we already tried to retry, or if the request was the refresh request itself, stop.
    if (originalRequest._retry || originalRequest.url === '/api/auth/token/refresh/') {
      return Promise.reject(error);
    }

    // 2. Handle 401 Unauthorized
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh (this assumes your backend sets the new cookies automatically)
        const res = await api.post("/api/auth/token/refresh/");
        const user = res.data.user;

        // Redirect to verification if phone is not verified
        if (user && !user.is_phone_verified) {
          const authFlowPages = ["/verify-phone", "/finish-signup", "/login", "/register"];
          if (!authFlowPages.includes(window.location.pathname)) {
            window.location.href = '/verify-phone';
            return Promise.reject(error); // Stop the original request retry
          }
        }

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (or expired), clear local auth state if necessary
        console.error("Refresh token expired, logging out...");
        // window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);