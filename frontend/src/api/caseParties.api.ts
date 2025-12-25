import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  CaseParty,
  PaginationParams,
} from "@/types/api.types";

export const casePartiesApi = {
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

  getMyAssignedCases: async (): Promise<ApiResponse<CaseParty[]>> => {
    const response = await axiosInstance.get<ApiResponse<CaseParty[]>>(
      "/case-parties/my-cases"
    );
    return response.data;
  },

  addCaseParty: async (
    data: Partial<CaseParty>
  ): Promise<ApiResponse<CaseParty>> => {
    const response = await axiosInstance.post<ApiResponse<CaseParty>>(
      "/case-parties",
      data
    );
    return response.data;
  },

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

  deleteCaseParty: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/case-parties/${id}`
    );
    return response.data;
  },
};
