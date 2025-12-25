import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Advocate,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Advocates API Service
 * Handles all advocate-related API calls
 */
export const advocatesApi = {
  /**
   * Get all advocates with pagination and filters (public)
   */
  getAllAdvocates: async (
    params?: SearchParams
  ): Promise<ApiResponse<{ advocates: Advocate[]; pagination: any }>> => {
    const response = await axiosInstance.get<ApiResponse<{ advocates: Advocate[]; pagination: any }>>(
      "/advocates",
      { params }
    );
    return response.data;
  },

  /**
   * Get advocate by ID (public)
   */
  getAdvocateById: async (id: string): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate>>(
      `/advocates/${id}`
    );
    return response.data;
  },

  /**
   * Get advocate by user ID (public)
   */
  getAdvocateByUserId: async (
    userId: string
  ): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate>>(
      `/advocates/user/${userId}`
    );
    return response.data;
  },

  /**
   * Get advocates by specialization (public)
   */
  getAdvocatesBySpecialization: async (
    specialization: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Advocate[]>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate[]>>(
      `/advocates/specialization/${specialization}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new advocate (admin only)
   */
  createAdvocate: async (
    advocateData: Partial<Advocate>
  ): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.post<ApiResponse<Advocate>>(
      "/advocates",
      advocateData
    );
    return response.data;
  },

  /**
   * Update advocate (admin only)
   */
  updateAdvocate: async (
    id: string,
    advocateData: Partial<Advocate>
  ): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.patch<ApiResponse<Advocate>>(
      `/advocates/${id}`,
      advocateData
    );
    return response.data;
  },

  /**
   * Delete advocate (admin only)
   */
  deleteAdvocate: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/advocates/${id}`
    );
    return response.data;
  },

  /**
   * Toggle advocate status (admin only)
   */
  toggleAdvocateStatus: async (id: string): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.patch<ApiResponse<Advocate>>(
      `/advocates/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get advocate statistics (admin only)
   */
  getAdvocateStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/advocates/statistics");
    return response.data;
  },
};
