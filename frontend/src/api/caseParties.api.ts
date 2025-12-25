import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CaseParty,
  PaginationParams,
  PartyType,
} from "@/types/api.types";

/**
 * Case Parties API Service
 * Handles all case party-related API calls
 */
export const casePartiesApi = {
  /**
   * Get all parties for a case (public)
   */
  getCaseParties: async (
    caseId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<CaseParty[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseParty[]>>(
      `/case-parties/case/${caseId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get parties by type for a case (public)
   */
  getPartiesByType: async (
    caseId: string,
    partyType: PartyType,
    params?: PaginationParams
  ): Promise<ApiResponse<CaseParty[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseParty[]>>(
      `/case-parties/case/${caseId}/type/${partyType}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get parties by advocate (public)
   */
  getPartiesByAdvocate: async (
    advocateId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<CaseParty[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseParty[]>>(
      `/case-parties/advocate/${advocateId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get case party by ID (public)
   */
  getCasePartyById: async (id: string): Promise<ApiResponse<CaseParty>> => {
    const response = await axiosInstance.get<ApiResponse<CaseParty>>(
      `/case-parties/${id}`
    );
    return response.data;
  },

  /**
   * Add case party (admin/judge/clerk/lawyer only)
   */
  addCaseParty: async (
    data: Partial<CaseParty>
  ): Promise<ApiResponse<CaseParty>> => {
    const response = await axiosInstance.post<ApiResponse<CaseParty>>(
      "/case-parties",
      data
    );
    return response.data;
  },

  /**
   * Update case party (admin/judge/clerk/lawyer only)
   */
  updateCaseParty: async (
    id: string,
    data: Partial<CaseParty>
  ): Promise<ApiResponse<CaseParty>> => {
    const response = await axiosInstance.patch<ApiResponse<CaseParty>>(
      `/case-parties/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete case party (admin/judge/clerk only)
   */
  deleteCaseParty: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/case-parties/${id}`
    );
    return response.data;
  },

  /**
   * Get case party statistics (admin/judge only)
   */
  getCasePartyStatistics: async (): Promise<
    ApiResponse<Record<string, unknown>>
  > => {
    const response = await axiosInstance.get<
      ApiResponse<Record<string, unknown>>
    >("/case-parties/statistics");
    return response.data;
  },
};
