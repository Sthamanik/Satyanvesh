import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CaseBookmark,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Case Bookmarks API Service
 * Handles all case bookmark-related API calls
 * All routes require authentication
 */
export const caseBookmarksApi = {
  /**
   * Add bookmark (authenticated)
   */
  addBookmark: async (
    caseId: string,
    notes?: string
  ): Promise<ApiResponse<CaseBookmark>> => {
    const response = await axiosInstance.post<ApiResponse<CaseBookmark>>(
      "/case-bookmarks",
      { caseId, notes }
    );
    return response.data;
  },

  /**
   * Get user's bookmarks (authenticated)
   */
  getUserBookmarks: async (
    params?: SearchParams
  ): Promise<ApiResponse<CaseBookmark[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseBookmark[]>>(
      "/case-bookmarks/my-bookmarks",
      { params }
    );
    return response.data;
  },

  /**
   * Get bookmarks with upcoming hearings (authenticated)
   */
  getBookmarksWithUpcomingHearings: async (
    params?: PaginationParams
  ): Promise<ApiResponse<CaseBookmark[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseBookmark[]>>(
      "/case-bookmarks/upcoming-hearings",
      { params }
    );
    return response.data;
  },

  /**
   * Check if case is bookmarked (authenticated)
   */
  checkBookmark: async (
    caseId: string
  ): Promise<ApiResponse<{ isBookmarked: boolean; bookmark?: CaseBookmark }>> => {
    const response = await axiosInstance.get<
      ApiResponse<{ isBookmarked: boolean; bookmark?: CaseBookmark }>
    >(`/case-bookmarks/check/${caseId}`);
    return response.data;
  },

  /**
   * Get bookmark by ID (authenticated)
   */
  getBookmarkById: async (id: string): Promise<ApiResponse<CaseBookmark>> => {
    const response = await axiosInstance.get<ApiResponse<CaseBookmark>>(
      `/case-bookmarks/${id}`
    );
    return response.data;
  },

  /**
   * Update bookmark (authenticated)
   */
  updateBookmark: async (
    id: string,
    data: { notes?: string }
  ): Promise<ApiResponse<CaseBookmark>> => {
    const response = await axiosInstance.patch<ApiResponse<CaseBookmark>>(
      `/case-bookmarks/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Remove bookmark by ID (authenticated)
   */
  removeBookmark: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/case-bookmarks/${id}`
    );
    return response.data;
  },

  /**
   * Remove bookmark by case ID (authenticated)
   */
  removeBookmarkByCase: async (caseId: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/case-bookmarks/case/${caseId}`
    );
    return response.data;
  },

  /**
   * Get user bookmark statistics (authenticated)
   */
  getUserBookmarkStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-bookmarks/my-statistics");
    return response.data;
  },

  /**
   * Get bookmark statistics (admin/judge only)
   */
  getBookmarkStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-bookmarks/admin/statistics");
    return response.data;
  },
};

