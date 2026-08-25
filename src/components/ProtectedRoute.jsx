import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {

  const { user, loading, updateActivity } = useAuth();

  if (loading) return <div>Loading secure session...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔥 ROLE-BASED ACCESS CONTROL
  if (role && user.role !== role) {
    return <div>Access denied: insufficient privileges</div>;
  }

  // 🔥 Update session activity
  updateActivity();

  return children;
}