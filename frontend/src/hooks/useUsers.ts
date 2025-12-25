import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "@/api/users.api";
import { queryKeys } from "@/lib/react-query";
import type {
  ApiResponse,
  User,
  UserRole,
  SearchParams,
} from "@/types/api.types";
import type { AxiosError } from "axios";

const toQueryParams = (
  params?: SearchParams
): Record<string, unknown> | undefined => (params ? { ...params } : undefined);

/**
 * Hook to get all users with error handling
 */
export const useGetAllUsers = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.users.all(toQueryParams(params)),
    queryFn: async () => {
      try {
        return await usersApi.getAllUsers(params);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to get user by ID
 */
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: async () => {
      try {
        return await usersApi.getUserById(id);
      } catch (error) {
        console.error(`Failed to fetch user ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

/**
 * Hook to get user by slug
 */
export const useGetUserBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.users.bySlug(slug),
    queryFn: async () => {
      try {
        return await usersApi.getUserBySlug(slug);
      } catch (error) {
        console.error(`Failed to fetch user by slug ${slug}:`, error);
        throw error;
      }
    },
    enabled: !!slug,
  });
};

/**
 * Hook to get users by role
 */
export const useGetUsersByRole = (role: string) => {
  return useQuery({
    queryKey: queryKeys.users.byRole(role),
    queryFn: async () => {
      try {
        return await usersApi.getUsersByRole(role);
      } catch (error) {
        console.error(`Failed to fetch users by role ${role}:`, error);
        throw error;
      }
    },
    enabled: !!role,
  });
};

/**
 * Hook to create user (admin only)
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      try {
        return await usersApi.createUser(userData);
      } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to create user");
    },
  });
};

/**
 * Hook to update user
 */
export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      try {
        return await usersApi.updateUser(id, userData);
      } catch (error) {
        console.error(`Failed to update user ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(queryKeys.users.detail(id), data);
      toast.success("User updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update user");
    },
  });
};

/**
 * Hook to update user role (admin only)
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: UserRole;
    }) => {
      try {
        return await usersApi.updateUserRole(userId, role);
      } catch (error) {
        console.error(`Failed to update role for user ${userId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      if (statusCode === 403) {
        toast.error("You don't have permission to update user roles");
      } else {
        toast.error(message || "Failed to update user role");
      }
    },
  });
};

/**
 * Hook to verify user (admin only)
 */
export const useVerifyUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await usersApi.verifyUser(userId);
      } catch (error) {
        console.error(`Failed to verify user ${userId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User verified successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      if (statusCode === 403) {
        toast.error("You don't have permission to verify users");
      } else {
        toast.error(message || "Failed to verify user");
      }
    },
  });
};

/**
 * Hook to delete user (admin only)
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await usersApi.deleteUser(userId);
      } catch (error) {
        console.error(`Failed to delete user ${userId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      if (statusCode === 403) {
        toast.error("You don't have permission to delete users");
      } else {
        toast.error(message || "Failed to delete user");
      }
    },
  });
};

/**
 * Hook to update user avatar
 */
export const useUpdateAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        return await usersApi.updateAvatar(userId, file);
      } catch (error) {
        console.error("Failed to update avatar:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("Avatar updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update avatar");
    },
  });
};

/**
 * Hook to remove user avatar
 */
export const useRemoveAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await usersApi.removeAvatar(userId);
      } catch (error) {
        console.error("Failed to remove avatar:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success("Avatar removed successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to remove avatar");
    },
  });
};

/**
 * Hook to get user statistics (admin only)
 */
export const useGetUserStatistics = () => {
  return useQuery({
    queryKey: queryKeys.users.statistics,
    queryFn: async () => {
      try {
        return await usersApi.getUserStatistics();
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
        throw error;
      }
    },
  });
};
