import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // If specified, only these roles can access
  requireAuth?: boolean; // Default true - require authentication
}

/**
 * Protected Route Component
 * Handles authentication and role-based access control
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login, save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for non-authenticated users only (like login/register)
  // and user is authenticated, redirect to home
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // User doesn't have required role
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
          <div className="text-center max-w-md">
            <div className="bg-status-error/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-status-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Access Denied
            </h2>
            <p className="text-text-secondary mb-6">
              You don't have permission to access this page. This page is
              restricted to {allowedRoles.join(", ")} roles only.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
}
