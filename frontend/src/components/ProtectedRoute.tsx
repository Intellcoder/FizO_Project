import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

type ProtectedRouteProps = {
  allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-6 items-center justify-center ">
            <Loader type="dots" color="#ef4444" size={100} speed={0.6} />
          </div>
        </div>
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
