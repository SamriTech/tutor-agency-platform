import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
export const RoleGuard = ({ children, role, secondaryRole = null }) => {

    const user = useAuthStore(state => state.user);

    if (!user) return <Navigate to="/login" />;

    if (user.role !== role && user.role !== secondaryRole) {
        return <Navigate to="/" />;
    }

    return children;
};
