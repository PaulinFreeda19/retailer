import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

import Login from "@/app/auth/login/page";
import Signup from "@/app/auth/signup/page";
import Dashboard from "@/app/dashboard/page";
import Inventory from "@/app/inventory/page";
import Orders from "@/app/orders/page";
import Delivery from "@/app/delivery/page";
import Settings from "@/app/settings/page";
import ProfilePage from "./features/profile/ProfilePage";

export default function App() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={user ? <AppLayout><Dashboard /></AppLayout> : <Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Inventory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Orders />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/delivery"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Delivery />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}