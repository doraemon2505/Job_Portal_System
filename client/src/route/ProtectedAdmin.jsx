import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdmin = ({ children }) => {
  const { user } = useAuth();

  // If not logged in → go to admin login
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // If not admin → block access
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdmin;