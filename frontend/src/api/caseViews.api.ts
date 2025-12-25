import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CaseView,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Case Views API Service
 * Handles all case view tracking-related API calls
 */
export const caseViewsApi = {
  /**
   * Track case view (public, optional authentication)
   */
  trackCaseView: async (
    caseId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<ApiResponse<CaseView>> => {
    const response = await axiosInstance.post<ApiResponse<CaseView>>(
      "/case-views/track",
      { caseId, ipAddress, userAgent }
    );
    return response.data;
  },

  /**
   * Get trending cases (public)
   */
  getTrendingCases: async (
    params?: SearchParams
  ): Promise<ApiResponse<CaseView[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseView[]>>(
      "/case-views/trending",
      { params }
    );
    return response.data;
  },

  /**
   * Get most viewed cases (public)
   */
  getMostViewedCases: async (
    params?: PaginationParams
  ): Promise<ApiResponse<CaseView[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseView[]>>(
      "/case-views/most-viewed",
      { params }
    );
    return response.data;
  },

  /**
   * Get user's viewed cases (authenticated)
   */
  getUserViewedCases: async (
    params?: SearchParams
  ): Promise<ApiResponse<CaseView[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseView[]>>(
      "/case-views/my-viewed-cases",
      { params }
    );
    return response.data;
  },

  /**
   * Get case view analytics (admin/judge only)
   */
  getCaseViewAnalytics: async (
    caseId: string,
    params?: SearchParams
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >(`/case-views/analytics/${caseId}`, { params });
    return response.data;
  },

  /**
   * Get overall statistics (admin/judge only)
   */
  getOverallStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-views/statistics/overall");
    return response.data;
  },

  /**
   * Get view statistics by date range (admin/judge only)
   */
  getViewStatisticsByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-views/statistics/date-range", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get peak viewing hours (admin/judge only)
   */
  getPeakViewingHours: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-views/statistics/peak-hours");
    return response.data;
  },
};

