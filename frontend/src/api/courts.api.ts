import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Court,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Courts API Service
 * Handles all court-related API calls
 */
export const courtsApi = {
  /**
   * Get all courts with pagination and filters (public)
   */
  getAllCourts: async (
    params?: SearchParams
  ): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get<ApiResponse<Court[]>>("/courts", {
      params,
    });
    return response.data;
  },

  /**
   * Get court by ID (public)
   */
  getCourtById: async (id: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.get<ApiResponse<Court>>(
      `/courts/${id}`
    );
    return response.data;
  },

  /**
   * Get court by slug (public)
   */
  getCourtBySlug: async (slug: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.get<ApiResponse<Court>>(
      `/courts/slug/${slug}`
    );
    return response.data;
  },

  /**
   * Get courts by type (public)
   */
  getCourtsByType: async (
    type: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get<ApiResponse<Court[]>>(
      `/courts/type/${type}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get courts by state (public)
   */
  getCourtsByState: async (
    state: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get<ApiResponse<Court[]>>(
      `/courts/state/${state}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new court (admin only)
   */
  createCourt: async (courtData: Partial<Court>): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.post<ApiResponse<Court>>(
      "/courts",
      courtData
    );
    return response.data;
  },

  /**
   * Update court (admin only)
   */
  updateCourt: async (
    id: string,
    courtData: Partial<Court>
  ): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.patch<ApiResponse<Court>>(
      `/courts/${id}`,
      courtData
    );
    return response.data;
  },

  /**
   * Delete court (admin only)
   */
  deleteCourt: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/courts/${id}`
    );
    return response.data;
  },

  /**
   * Toggle court status (admin only)
   */
  toggleCourtStatus: async (id: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.patch<ApiResponse<Court>>(
      `/courts/${id}/toggle`
    );
    return response.data;
  },

  /**
   * Get court statistics (admin only)
   */
  getCourtStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/courts/statistics");
    return response.data;
  },
};
