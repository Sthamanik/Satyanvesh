import axiosInstance from "@/lib/axios";
import type { ApiResponse, AuthResponse, User } from "@/types/api.types";

// Register payload
export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: File;
}

// Login payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Change password payload
export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

// Refresh token payload
export interface RefreshTokenPayload {
  refreshToken: string;
}

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: async (
    payload: RegisterPayload
  ): Promise<ApiResponse<AuthResponse>> => {
    const formData = new FormData();

    formData.append("fullName", payload.fullName);
    formData.append("username", payload.username);
    formData.append("email", payload.email);
    formData.append("password", payload.password);

    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }

    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Store tokens
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);

    return response.data;
  },

  /**
   * Login user
   */
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload
    );

    // Store tokens
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("refreshToken", response.data.data.refreshToken);

    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/logout"
    );

    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    return response.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (
    payload: RefreshTokenPayload
  ): Promise<ApiResponse<{ accessToken: string }>> => {
    const response = await axiosInstance.post<
      ApiResponse<{ accessToken: string }>
    >("/auth/refresh-token", payload);

    // Store new access token
    localStorage.setItem("accessToken", response.data.data.accessToken);

    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (
    payload: ChangePasswordPayload
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      "/auth/change-password",
      payload
    );
    return response.data;
  },
};
