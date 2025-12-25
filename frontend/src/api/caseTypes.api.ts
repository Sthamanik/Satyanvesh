import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CaseType,
  PaginationParams,
  SearchParams,
  CaseCategory,
} from "@/types/api.types";

/**
 * Case Types API Service
 * Handles all case type-related API calls
 */
export const caseTypesApi = {
  /**
   * Get all case types with pagination and filters (public)
   */
  getAllCaseTypes: async (
    params?: SearchParams
  ): Promise<ApiResponse<CaseType[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseType[]>>(
      "/case-types",
      { params }
    );
    return response.data;
  },

  /**
   * Get case type by ID (public)
   */
  getCaseTypeById: async (id: string): Promise<ApiResponse<CaseType>> => {
    const response = await axiosInstance.get<ApiResponse<CaseType>>(
      `/case-types/${id}`
    );
    return response.data;
  },

  /**
   * Get case type by slug (public)
   */
  getCaseTypeBySlug: async (slug: string): Promise<ApiResponse<CaseType>> => {
    const response = await axiosInstance.get<ApiResponse<CaseType>>(
      `/case-types/slug/${slug}`
    );
    return response.data;
  },

  /**
   * Get case types by category (public)
   */
  getCaseTypesByCategory: async (
    category: CaseCategory,
    params?: PaginationParams
  ): Promise<ApiResponse<CaseType[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseType[]>>(
      `/case-types/category/${category}`,
      { params }
    );
    return response.data;
  },

  /**
   * Create new case type (admin only)
   */
  createCaseType: async (
    caseTypeData: Partial<CaseType>
  ): Promise<ApiResponse<CaseType>> => {
    const response = await axiosInstance.post<ApiResponse<CaseType>>(
      "/case-types",
      caseTypeData
    );
    return response.data;
  },

  /**
   * Update case type (admin only)
   */
  updateCaseType: async (
    id: string,
    caseTypeData: Partial<CaseType>
  ): Promise<ApiResponse<CaseType>> => {
    const response = await axiosInstance.patch<ApiResponse<CaseType>>(
      `/case-types/${id}`,
      caseTypeData
    );
    return response.data;
  },

  /**
   * Delete case type (admin only)
   */
  deleteCaseType: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/case-types/${id}`
    );
    return response.data;
  },

  /**
   * Toggle case type status (admin only)
   */
  toggleCaseTypeStatus: async (id: string): Promise<ApiResponse<CaseType>> => {
    const response = await axiosInstance.patch<ApiResponse<CaseType>>(
      `/case-types/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * Get case type statistics (admin only)
   */
  getCaseTypeStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-types/statistics");
    return response.data;
  },
};

