import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const RecordsPage = lazy(() => import("./pages/RecordsPage"));
const AdminPanelPage = lazy(() => import("./pages/AdminPanelPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
          Loading workspace...
        </div>
      }
    >
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/app" replace /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/app" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/app" replace /> : <RegisterPage />}
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute allowedRoles={["viewer", "analyst", "admin"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route
            path="insights"
            element={
              <ProtectedRoute allowedRoles={["analyst", "admin"]}>
                <InsightsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={["analyst", "admin"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="records"
            element={
              <ProtectedRoute allowedRoles={["analyst", "admin"]}>
                <RecordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
