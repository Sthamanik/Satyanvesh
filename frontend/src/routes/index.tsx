import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader2 } from "lucide-react";
import HearingsListPage from "@/pages/hearings/HearingsListPage";
import CasesListPage from "@/pages/cases/CasesListPage";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const DashboardHomePage = lazy(
  () => import("@/pages/dashboard/DashboardHomePage")
);

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-primary">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
      <p className="text-text-secondary">Loading...</p>
    </div>
  </div>
);

// Placeholder pages for routes (we'll build these later)
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="text-center py-12">
    <h1 className="text-3xl font-bold text-brand-primary mb-4">{title}</h1>
    <p className="text-text-secondary">
      This page will be implemented in the next phase
    </p>
  </div>
);

/**
 * Main Routes Configuration
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Guest Routes (Only for non-authenticated users) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        {/* Protected Routes with Dashboard Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "judge", "clerk"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
        </Route>

        {/* Other Protected Routes (accessible to all authenticated users) */}
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CasesListPage />} />
        </Route>

        <Route
          path="/hearings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HearingsListPage />} />
        </Route>

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Documents" />} />
        </Route>

        <Route
          path="/advocates"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Advocates" />} />
        </Route>

        <Route
          path="/courts"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Courts" />} />
        </Route>

        <Route
          path="/case-types"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Case Types" />} />
        </Route>

        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="My Bookmarks" />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "judge"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Analytics" />} />
        </Route>

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="User Management" />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlaceholderPage title="Profile" />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
