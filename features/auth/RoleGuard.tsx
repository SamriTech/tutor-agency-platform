import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
export const RoleGuard = ({ children, role }) => {

    const user = useAuthStore(state => state.user);

    if (!user) return <Navigate to="/login" />;

    if (user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
};
