import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { casesApi } from '@/api/cases.api';
import { queryKeys } from '@/lib/react-query';
import type { Case, SearchParams } from '@/types/api.types';
import type { AxiosError } from 'axios';

/**
 * Helper to make SearchParams compatible with queryKeys
 */
const toQueryParams = (
  params?: SearchParams
): Record<string, unknown> | undefined =>
  params ? { ...params } : undefined;

/**
 * Hook to get all cases
 */
export const useGetCases = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.cases.all(toQueryParams(params)),
    queryFn: () => casesApi.getAllCases(params),
    placeholderData: (prev) => prev,
  });
};

/**
 * Hook to search cases with debouncing
 */
export const useSearchCases = (query: string, params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.cases.search(query),
    queryFn: () => casesApi.searchCases(query, toQueryParams(params)),
    enabled: query.length > 0, // Only search if query is not empty
    placeholderData: (prev) => prev,
  });
};

/**
 * Hook to get case by ID
 */
export const useGetCaseById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: () => casesApi.getCaseById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get case by slug
 */
export const useGetCaseBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.cases.bySlug(slug),
    queryFn: () => casesApi.getCaseBySlug(slug),
    enabled: !!slug,
  });
};

/**
 * Hook to get case by case number
 */
export const useGetCaseByCaseNumber = (caseNumber: string) => {
  return useQuery({
    queryKey: queryKeys.cases.byCaseNumber(caseNumber),
    queryFn: () => casesApi.getCaseByCaseNumber(caseNumber),
    enabled: !!caseNumber,
  });
};

/**
 * Hook to create case
 */
export const useCreateCase = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (caseData: Partial<Case>) => casesApi.createCase(caseData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case created successfully');
      navigate(`/cases/${data.data._id}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create case';
      toast.error(message);
    },
  });
};

/**
 * Hook to update case
 */
export const useUpdateCase = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caseData: Partial<Case>) => casesApi.updateCase(id, caseData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.setQueryData(queryKeys.cases.detail(id), data);
      toast.success('Case updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update case';
      toast.error(message);
    },
  });
};

/**
 * Hook to update case status
 */
export const useUpdateCaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      casesApi.updateCaseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case status updated successfully');
    },
    onError: (error: AxiosError<any>) => {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete case
 */
export const useDeleteCase = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) => casesApi.deleteCase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case deleted successfully');
      navigate('/cases');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete case';
      toast.error(message);
    },
  });
};