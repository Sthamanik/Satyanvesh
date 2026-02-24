import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type ChangePasswordPayload,
} from "@/api/auth.api";
import { useAuthStore } from "@/routes/stores/auth.store";
import { queryKeys } from "@/lib/react-query";
import type { AxiosError } from "axios";
import type { ApiResponse, User } from "@/types/api.types";
import { useEffect } from "react";

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginPayload) => authApi.login(credentials),
    onSuccess: (data) => {
      // Update auth store
      setUser(data.data.user);
      setTokens(data.data.accessToken, data.data.refreshToken);

      toast.success(`Welcome back, ${data.data.user.fullName}!`);

      // Navigate based on role
      const role = data.data.user.role;
      if (role === "admin" || role === "judge" || role === "clerk") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterPayload) => authApi.register(userData),
    onSuccess: (data) => {
      // Update auth store
      setUser(data.data.user);
      setTokens(data.data.accessToken, data.data.refreshToken);

      toast.success(`Welcome to Satyanvesh, ${data.data.user.fullName}!`);
      navigate("/");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear auth state
      clearAuth();

      // Clear all cached queries
      queryClient.clear();

      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      // Even if API call fails, clear local state
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};

/**
 * Hook to get current user
 * Only runs when user is authenticated
 */
export const useCurrentUser = () => {
  const { isAuthenticated, setUser, clearAuth } = useAuthStore();

  const query = useQuery<ApiResponse<User>, AxiosError>({
    queryKey: queryKeys.auth.me,
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on failure
  });

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data.data);
    }

    if (query.isError) {
      clearAuth();
    }
  }, [query.isSuccess, query.isError, query.data, setUser, clearAuth]);

  return query;
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwords: ChangePasswordPayload) =>
      authApi.changePassword(passwords),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
};

/**
 * Hook to check if user has specific role(s)
 */
export const useHasRole = (roles: string | string[]) => {
  const { hasRole } = useAuthStore();
  return hasRole(roles);
};

/**
 * Hook to get user role helpers
 */
export const useUserRole = () => {
  const { isAdmin, isJudge, isClerk, isLawyer } = useAuthStore();

  return {
    isAdmin: isAdmin(),
    isJudge: isJudge(),
    isClerk: isClerk(),
    isLawyer: isLawyer(),
    isCitizen: !isAdmin() && !isJudge() && !isClerk() && !isLawyer(),
  };
};
