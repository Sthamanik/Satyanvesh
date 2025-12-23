import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Document,
  PaginationParams,
} from "@/types/api.types";

export interface UploadDocumentPayload {
  caseId: string;
  hearingId?: string;
  title: string;
  type: string;
  isPublic: boolean;
  description?: string;
  document: File;
}

/**
 * Documents API Service
 */
export const documentsApi = {
  /**
   * Upload document
   */
  uploadDocument: async (
    payload: UploadDocumentPayload
  ): Promise<ApiResponse<Document>> => {
    const formData = new FormData();
    formData.append("case", payload.caseId);
    if (payload.hearingId) formData.append("hearing", payload.hearingId);
    formData.append("title", payload.title);
    formData.append("type", payload.type);
    formData.append("isPublic", String(payload.isPublic));
    if (payload.description)
      formData.append("description", payload.description);
    formData.append("document", payload.document);

    const response = await axiosInstance.post<ApiResponse<Document>>(
      "/documents/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  /**
   * Get case documents
   */
  getCaseDocuments: async (
    caseId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Document[]>> => {
    const response = await axiosInstance.get<ApiResponse<Document[]>>(
      `/documents/case/${caseId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get public documents for a case
   */
  getPublicDocuments: async (
    caseId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Document[]>> => {
    const response = await axiosInstance.get<ApiResponse<Document[]>>(
      `/documents/case/${caseId}/public`,
      { params }
    );
    return response.data;
  },

  /**
   * Get documents by type
   */
  getDocumentsByType: async (
    caseId: string,
    type: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Document[]>> => {
    const response = await axiosInstance.get<ApiResponse<Document[]>>(
      `/documents/case/${caseId}/type/${type}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get hearing documents
   */
  getHearingDocuments: async (
    hearingId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Document[]>> => {
    const response = await axiosInstance.get<ApiResponse<Document[]>>(
      `/documents/hearing/${hearingId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get document by ID
   */
  getDocumentById: async (id: string): Promise<ApiResponse<Document>> => {
    const response = await axiosInstance.get<ApiResponse<Document>>(
      `/documents/${id}`
    );
    return response.data;
  },

  /**
   * Update document
   */
  updateDocument: async (
    id: string,
    data: Partial<Document>
  ): Promise<ApiResponse<Document>> => {
    const response = await axiosInstance.patch<ApiResponse<Document>>(
      `/documents/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/documents/${id}`
    );
    return response.data;
  },
};
