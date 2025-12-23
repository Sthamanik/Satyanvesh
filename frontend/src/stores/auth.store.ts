import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/api.types";

// Auth state interface
interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: () => boolean;
  isJudge: () => boolean;
  isClerk: () => boolean;
  isLawyer: () => boolean;
}

/**
 * Zustand Authentication Store
 * Manages user authentication state with localStorage persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user data
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      // Set authentication tokens
      setTokens: (accessToken, refreshToken) => {
        // Also store in localStorage for axios interceptor
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // Clear authentication state
      clearAuth: () => {
        // Remove from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Check if user has specific role(s)
      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;

        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
      },

      // Role helper methods
      isAdmin: () => get().hasRole("admin"),
      isJudge: () => get().hasRole("judge"),
      isClerk: () => get().hasRole("clerk"),
      isLawyer: () => get().hasRole("lawyer"),
    }),
    {
      name: "satyanvesh-auth", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for optimized re-renders
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
