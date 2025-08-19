import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { authUser, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length > 0 &&
    (!authUser || !allowedRoles.includes(authUser.role))
  ) {
    return <Navigate to="/" replace />;
  }

  if (
    !requireAuth &&
    isAuthenticated &&
    ["/login", "/signup"].includes(location.pathname)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
