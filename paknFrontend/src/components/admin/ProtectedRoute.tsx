import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute() {

  // const token = getToken()
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return <Outlet />
}