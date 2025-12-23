import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { documentsApi, type UploadDocumentPayload } from "@/api/documents.api";
import { queryKeys } from "@/lib/react-query";

/**
 * Get case documents
 */
export const useGetCaseDocuments = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.documents.byCase(caseId),
    queryFn: () => documentsApi.getCaseDocuments(caseId),
    enabled: !!caseId,
  });
};

/**
 * Get public documents for a case
 */
export const useGetPublicDocuments = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.documents.public(caseId),
    queryFn: () => documentsApi.getPublicDocuments(caseId),
    enabled: !!caseId,
  });
};

/**
 * Get documents by type
 */
export const useGetDocumentsByType = (caseId: string, type: string) => {
  return useQuery({
    queryKey: queryKeys.documents.byType(caseId, type),
    queryFn: () => documentsApi.getDocumentsByType(caseId, type),
    enabled: !!caseId && !!type,
  });
};

/**
 * Get hearing documents
 */
export const useGetHearingDocuments = (hearingId: string) => {
  return useQuery({
    queryKey: queryKeys.documents.byHearing(hearingId),
    queryFn: () => documentsApi.getHearingDocuments(hearingId),
    enabled: !!hearingId,
  });
};

/**
 * Get document by ID
 */
export const useGetDocumentById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.documents.detail(id),
    queryFn: () => documentsApi.getDocumentById(id),
    enabled: !!id,
  });
};

/**
 * Upload document
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) =>
      documentsApi.uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document uploaded successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload document";
      toast.error(message);
    },
  });
};

/**
 * Update document
 */
export const useUpdateDocument = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<any>) => documentsApi.updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update document";
      toast.error(message);
    },
  });
};

/**
 * Delete document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete document";
      toast.error(message);
    },
  });
};
