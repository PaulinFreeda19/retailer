import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

export default function ProtectedRoute({ children }: any) {
  const user = useAppSelector((s) => s.auth.user);
  return user ? children : <Navigate to="/login" />;
}