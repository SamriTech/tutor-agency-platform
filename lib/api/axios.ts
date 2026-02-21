import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Access Cookie)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Rotates the cookies on the backend
        await api.post("/api/auth/token/refresh/");
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed/expired
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);