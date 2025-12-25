import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Case,
  PaginationParams,
  SearchParams,
} from "@/types/api.types";

/**
 * Cases API Service
 * Handles all case-related API calls
 */
export const casesApi = {
  /**
   * Get all cases with pagination and filters
   */
  getAllCases: async (params?: SearchParams): Promise<ApiResponse<{ cases: Case[]; pagination: any }>> => {
    const response = await axiosInstance.get<ApiResponse<{ cases: Case[]; pagination: any }>>("/cases", {
      params,
    });
    return response.data;
  },

  /**
   * Search cases
   */
  searchCases: async (
    query: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Case[]>> => {
    const response = await axiosInstance.get<ApiResponse<Case[]>>(
      "/cases/search",
      {
        params: { search: query, ...params },
      }
    );
    return response.data;
  },

  /**
   * Get case by ID
   */
  getCaseById: async (id: string): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.get<ApiResponse<Case>>(`/cases/${id}`);
    return response.data;
  },

  /**
   * Get case by slug
   */
  getCaseBySlug: async (slug: string): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.get<ApiResponse<Case>>(
      `/cases/slug/${slug}`
    );
    return response.data;
  },

  /**
   * Get case by case number
   */
  getCaseByCaseNumber: async (
    caseNumber: string
  ): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.get<ApiResponse<Case>>(
      `/cases/case-number/${caseNumber}`
    );
    return response.data;
  },

  /**
   * Get cases by court
   */
  getCasesByCourt: async (
    courtId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Case[]>> => {
    const response = await axiosInstance.get<ApiResponse<Case[]>>(
      `/cases/court/${courtId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get cases by case type
   */
  getCasesByCaseType: async (
    caseTypeId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Case[]>> => {
    const response = await axiosInstance.get<ApiResponse<Case[]>>(
      `/cases/case-type/${caseTypeId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get cases by user
   */
  getCasesByUser: async (
    userId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Case[]>> => {
    const response = await axiosInstance.get<ApiResponse<Case[]>>(
      `/cases/user/${userId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new case (admin/judge/clerk only)
   */
  createCase: async (caseData: Partial<Case>): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.post<ApiResponse<Case>>(
      "/cases",
      caseData
    );
    return response.data;
  },

  /**
   * Update case (admin/judge/clerk only)
   */
  updateCase: async (
    id: string,
    caseData: Partial<Case>
  ): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.patch<ApiResponse<Case>>(
      `/cases/${id}`,
      caseData
    );
    return response.data;
  },

  /**
   * Update case status (admin/judge/clerk only)
   */
  updateCaseStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Case>> => {
    const response = await axiosInstance.patch<ApiResponse<Case>>(
      `/cases/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Delete case (admin only)
   */
  deleteCase: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/cases/${id}`
    );
    return response.data;
  },

  /**
   * Get case statistics (admin/judge only)
   */
  getCaseStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/cases/statistics");
    return response.data;
  },
};
