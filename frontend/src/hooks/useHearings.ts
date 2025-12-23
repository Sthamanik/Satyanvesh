import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { hearingsApi } from "@/api/hearings.api";
import { queryKeys } from "@/lib/react-query";
import type { ApiResponse, Hearing, SearchParams } from "@/types/api.types";
import type { AxiosError } from "axios";

const toQueryParams = (
  params?: SearchParams
): Record<string, unknown> | undefined => (params ? { ...params } : undefined);

/**
 * Hook to get all hearings
 */
export const useGetHearings = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.hearings.all(toQueryParams(params)),
    queryFn: () => hearingsApi.getAllHearings(params),
    placeholderData: (keep) => keep,
  });
};

/**
 * Hook to get case hearings
 */
export const useGetCaseHearings = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.hearings.byCase(caseId),
    queryFn: () => hearingsApi.getCaseHearings(caseId),
    enabled: !!caseId,
  });
};

/**
 * Hook to get hearing by ID
 */
export const useGetHearingById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.hearings.detail(id),
    queryFn: () => hearingsApi.getHearingById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get upcoming hearings
 */
export const useGetUpcomingHearings = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.hearings.upcoming(toQueryParams(params)),
    queryFn: () => hearingsApi.getUpcomingHearings(params),
  });
};

/**
 * Hook to get today's hearings
 */
export const useGetTodaysHearings = () => {
  return useQuery({
    queryKey: queryKeys.hearings.today,
    queryFn: () => hearingsApi.getTodaysHearings(),
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
};

/**
 * Hook to get hearings by judge
 */
export const useGetHearingsByJudge = (judgeId: string) => {
  return useQuery({
    queryKey: queryKeys.hearings.byJudge(judgeId),
    queryFn: () => hearingsApi.getHearingsByJudge(judgeId),
    enabled: !!judgeId,
  });
};

/**
 * Hook to create hearing
 */
export const useCreateHearing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hearingData: Partial<Hearing>) =>
      hearingsApi.createHearing(hearingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing scheduled successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message || "Failed to create hearing";
      toast.error(message);
    },
  });
};

/**
 * Hook to update hearing
 */
export const useUpdateHearing = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hearingData: Partial<Hearing>) =>
      hearingsApi.updateHearing(id, hearingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      queryClient.setQueryData(queryKeys.hearings.detail(id), data);
      toast.success("Hearing updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message || "Failed to update hearing";
      toast.error(message);
    },
  });
};

/**
 * Hook to update hearing status
 */
export const useUpdateHearingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      hearingsApi.updateHearingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing status updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message || "Failed to update status";
      toast.error(message);
    },
  });
};

/**
 * Hook to delete hearing
 */
export const useDeleteHearing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hearingsApi.deleteHearing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing deleted successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message =
        error.response?.data?.message || "Failed to delete hearing";
      toast.error(message);
    },
  });
};
