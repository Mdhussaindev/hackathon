
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ConfigProvider } from "antd";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Setup from "./pages/auth/Setup";
import Login from "./pages/auth/Login";
import ChangePassword from "./pages/auth/ChangePassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

import "./styles/global.css";

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loader">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

function RequirePasswordChange({ children }) {
  const { user } = useAuth();

  if (user?.mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 10,
          fontFamily: "Inter, Arial, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <RequirePasswordChange>
                    <DashboardLayout />
                  </RequirePasswordChange>
                </ProtectedRoute>
              }
            >
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["hr"]}>
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employee/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["employee"]}>
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<HomeRedirect />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
