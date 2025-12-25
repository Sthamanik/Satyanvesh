import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  User,
  UserRole,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Users API Service
 * Handles all user-related API calls
 */
export const usersApi = {
  /**
   * Get all users with pagination and filters (authenticated)
   */
  getAllUsers: async (params?: SearchParams): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>("/users", {
      params,
    });
    return response.data;
  },

  /**
   * Get user by ID (public)
   */
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Get user by slug (public)
   */
  getUserBySlug: async (slug: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      `/users/slug/${slug}`
    );
    return response.data;
  },

  /**
   * Get users by role (public)
   */
  getUsersByRole: async (
    role: string,
    params?: PaginationParams
  ): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      `/users/role/${role}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new user (admin only)
   */
  createUser: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/users",
      userData
    );
    return response.data;
  },

  /**
   * Update user (authenticated)
   */
  updateUser: async (
    id: string,
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/users/${id}`,
      userData
    );
    return response.data;
  },

  /**
   * Update user role (admin only)
   */
  updateUserRole: async (
    userId: string,
    role: UserRole
  ): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/users/${userId}/role`,
      { role }
    );
    return response.data;
  },

  /**
   * Verify user (admin only)
   */
  verifyUser: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/users/${userId}/verify`,
      {}
    );
    return response.data;
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/users/${userId}`
    );
    return response.data;
  },

  /**
   * Update user avatar
   */
  updateAvatar: async (
    userId: string,
    file: File
  ): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.patch<ApiResponse<User>>(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Remove user avatar
   */
  removeAvatar: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.delete<ApiResponse<User>>(
      `/users/${userId}/avatar`
    );
    return response.data;
  },

  /**
   * Get user statistics (admin only)
   */
  getUserStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/users/statistics");
    return response.data;
  },
};
