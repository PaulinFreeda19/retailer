import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  loginRequest,
  logout,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((s) => s.auth);

  const login = (email: string, password: string) => {
    dispatch(loginRequest({ email, password }));
  };

  const signout = () => {
    dispatch(logout());
  };

  return {
    user,
    loading,
    error,
    login,
    signout,
  };
};