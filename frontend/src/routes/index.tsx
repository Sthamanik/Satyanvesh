import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestRoute from "@/components/auth/GuestRoute";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader2 } from "lucide-react";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const DashboardHomePage = lazy(
  () => import("@/pages/dashboard/DashboardHomePage")
);
const CasesListPage = lazy(() => import("@/pages/cases/CasesListPage"));
const CaseDetailPage = lazy(() => import("@/pages/cases/CaseDetailPage"));
const HearingsListPage = lazy(
  () => import("@/pages/hearings/HearingsListPage")
);
const DocumentsPage = lazy(() => import("@/pages/documents/DocumentsPage"));
const CourtsListPage = lazy(() => import("@/pages/courts/courtsListPage"));
const AdvocatesListPage = lazy(
  () => import("@/pages/advocate/AdvocateListPage")
);
const UserManagementPage = lazy(
  () => import("@/pages/admin/UserManagementPage")
);
const AnalyticsPage = lazy(() => import("@/pages/analytics/AnalyticsPage"));
const PublicCasesPage = lazy(() => import("@/pages/public/PublicCasePage"));
const PublicCaseDetailPage = lazy(
  () => import("@/pages/public/PublicCaseDetailPage")
);
const CaseCreatePage = lazy(() => import("@/pages/cases/CaseCreatePage"));
const CaseHearingsPage = lazy(
  () => import("@/pages/hearings/CaseHearingsPage")
);
const BookmarksPage = lazy(() => import("@/pages/bookmarks/BookmarksPage"));
const CaseTypesPage = lazy(() => import("@/pages/caseTypes/CaseTypesPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));

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
// const PlaceholderPage = ({ title }: { title: string }) => (
//   <div className="text-center py-12">
//     <h1 className="text-3xl font-bold text-brand-primary mb-4">{title}</h1>
//     <p className="text-text-secondary">
//       This page will be implemented in the next phase
//     </p>
//   </div>
// );

/**
 * Main Routes Configuration
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ============================================
            PUBLIC ROUTES (No Authentication Required)
        ============================================ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/public/cases" element={<PublicCasesPage />} />
        <Route path="/public/cases/:id" element={<PublicCaseDetailPage />} />

        {/* ============================================
            GUEST ROUTES (Only for Non-Authenticated Users)
        ============================================ */}
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

        {/* ============================================
            PROTECTED ROUTES - DASHBOARD
            (Admin, Judge, Clerk only)
        ============================================ */}
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

        {/* ============================================
            PROTECTED ROUTES - CASES
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CasesListPage />} />
          <Route path="create" element={<CaseCreatePage />} />
          <Route path=":id" element={<CaseDetailPage />} />
          <Route path=":id/hearings" element={<CaseHearingsPage />} />
        </Route>

        {/* ============================================
            PROTECTED ROUTES - HEARINGS
            (All Authenticated Users)
        ============================================ */}
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

        {/* ============================================
            PROTECTED ROUTES - DOCUMENTS
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/cases" replace />} />
          <Route path=":id" element={<DocumentsPage />} />
        </Route>

        {/* ============================================
            PROTECTED ROUTES - COURTS
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/courts"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CourtsListPage />} />
        </Route>

        {/* ============================================
            PROTECTED ROUTES - ADVOCATES
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/advocates"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdvocatesListPage />} />
        </Route>


        {/* ============================================
            PROTECTED ROUTES - BOOKMARKS
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookmarksPage />} />
        </Route>

        {/* ============================================
            ADMIN ROUTES - USER MANAGEMENT
            (Admin Only)
        ============================================ */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserManagementPage />} />
        </Route>

        {/* ============================================
            ADMIN/JUDGE ROUTES - ANALYTICS
            (Admin and Judge Only)
        ============================================ */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "judge"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AnalyticsPage />} />
        </Route>

        {/* ============================================
            SETTINGS & PROFILE
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfilePage />} />
        </Route>

        {/* ============================================
            CASE TYPES
            (All Authenticated Users)
        ============================================ */}
        <Route
          path="/case-types"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CaseTypesPage />} />
        </Route>

        {/* ============================================
            404 - CATCH ALL
        ============================================ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
