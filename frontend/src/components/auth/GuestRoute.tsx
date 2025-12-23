import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Guest Route Component
 * Only accessible to non-authenticated users
 * Redirects authenticated users to home
 */
export default function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // If user is authenticated, redirect based on role
  if (isAuthenticated && user) {
    const role = user.role;

    // Redirect admin, judge, clerk to dashboard
    if (role === "admin" || role === "judge" || role === "clerk") {
      return <Navigate to="/dashboard" replace />;
    }

    // Redirect others to home
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show the page
  return <>{children}</>;
}
