import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { caseTypesApi } from "@/api/caseTypes.api";
import { queryKeys } from "@/lib/react-query";
import type { ApiResponse, CaseType, SearchParams } from "@/types/api.types";
import type { AxiosError } from "axios";

/**
 * Hook to get all case types
 */
export const useGetCaseTypes = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.caseTypes.all(params as Record<string, unknown>),
    queryFn: () => caseTypesApi.getAllCaseTypes(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Hook to get case type by ID
 */
export const useGetCaseTypeById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.caseTypes.detail(id),
    queryFn: () => caseTypesApi.getCaseTypeById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get case type by slug
 */
export const useGetCaseTypeBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.caseTypes.bySlug(slug),
    queryFn: () => caseTypesApi.getCaseTypeBySlug(slug),
    enabled: !!slug,
  });
};

/**
 * Hook to get case types by category
 */
export const useGetCaseTypesByCategory = (
  category: string,
  params?: SearchParams
) => {
  return useQuery({
    queryKey: queryKeys.caseTypes.byCategory(category),
    queryFn: () => caseTypesApi.getCaseTypesByCategory(category, params),
    enabled: !!category,
  });
};

/**
 * Hook to create case type (admin only)
 */
export const useCreateCaseType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseTypeData: Partial<CaseType>) => {
      return await caseTypesApi.createCaseType(caseTypeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-types"] });
      toast.success("Case type created successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to create case type");
    },
  });
};

/**
 * Hook to update case type (admin only)
 */
export const useUpdateCaseType = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseTypeData: Partial<CaseType>) => {
      return await caseTypesApi.updateCaseType(id, caseTypeData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["case-types"] });
      queryClient.setQueryData(queryKeys.caseTypes.detail(id), data);
      toast.success("Case type updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update case type");
    },
  });
};

/**
 * Hook to delete case type (admin only)
 */
export const useDeleteCaseType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await caseTypesApi.deleteCaseType(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-types"] });
      toast.success("Case type deleted successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to delete case type");
    },
  });
};

/**
 * Hook to toggle case type status (admin only)
 */
export const useToggleCaseTypeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await caseTypesApi.toggleCaseTypeStatus(id);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["case-types"] });
      queryClient.setQueryData(queryKeys.caseTypes.detail(id), data);
      toast.success("Case type status updated");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update case type status");
    },
  });
};

