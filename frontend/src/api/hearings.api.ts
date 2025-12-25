import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Hearing,
  HearingStatus,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Hearings API Service
 * Handles all hearing-related API calls
 */
export const hearingsApi = {
  /**
   * Get case hearings
   */
  getCaseHearings: async (
    caseId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Hearing[]>> => {
    const response = await axiosInstance.get<ApiResponse<Hearing[]>>(
      `/hearings/case/${caseId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get hearing by ID
   */
  getHearingById: async (id: string): Promise<ApiResponse<Hearing>> => {
    const response = await axiosInstance.get<ApiResponse<Hearing>>(
      `/hearings/${id}`
    );
    return response.data;
  },

  /**
   * Get upcoming hearings
   */
  getUpcomingHearings: async (
    params?: SearchParams
  ): Promise<ApiResponse<Hearing[]>> => {
    const response = await axiosInstance.get<ApiResponse<Hearing[]>>(
      "/hearings/upcoming",
      { params }
    );
    return response.data;
  },

  /**
   * Get today's hearings
   */
  getTodaysHearings: async (): Promise<ApiResponse<Hearing[]>> => {
    const response = await axiosInstance.get<ApiResponse<Hearing[]>>(
      "/hearings/today"
    );
    return response.data;
  },

  /**
   * Get hearings by judge
   */
  getHearingsByJudge: async (
    judgeId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Hearing[]>> => {
    const response = await axiosInstance.get<ApiResponse<Hearing[]>>(
      `/hearings/judge/${judgeId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new hearing (admin/judge/clerk only)
   */
  createHearing: async (
    hearingData: Partial<Hearing>
  ): Promise<ApiResponse<Hearing>> => {
    const response = await axiosInstance.post<ApiResponse<Hearing>>(
      "/hearings",
      hearingData
    );
    return response.data;
  },

  /**
   * Update hearing (admin/judge/clerk only)
   */
  updateHearing: async (
    id: string,
    hearingData: Partial<Hearing>
  ): Promise<ApiResponse<Hearing>> => {
    const response = await axiosInstance.patch<ApiResponse<Hearing>>(
      `/hearings/${id}`,
      hearingData
    );
    return response.data;
  },

  /**
   * Update hearing status (admin/judge/clerk only)
   */
  updateHearingStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Hearing>> => {
    const response = await axiosInstance.patch<ApiResponse<Hearing>>(
      `/hearings/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Delete hearing (admin only)
   */
  deleteHearing: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/hearings/${id}`
    );
    return response.data;
  },

  /**
   * Get hearing statistics (admin/judge only)
   */
  getHearingStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/hearings/statistics");
    return response.data;
  },
};
