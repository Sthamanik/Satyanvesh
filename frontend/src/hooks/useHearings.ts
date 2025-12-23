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
 * Hook to get all hearings with error handling
 */
export const useGetHearings = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.hearings.all(toQueryParams(params)),
    queryFn: async () => {
      try {
        return await hearingsApi.getAllHearings(params);
      } catch (error) {
        // Log error for debugging
        console.error("Failed to fetch hearings:", error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 (endpoint not found)
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to get case hearings
 */
export const useGetCaseHearings = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.hearings.byCase(caseId),
    queryFn: async () => {
      try {
        return await hearingsApi.getCaseHearings(caseId);
      } catch (error) {
        console.error(`Failed to fetch hearings for case ${caseId}:`, error);
        throw error;
      }
    },
    enabled: !!caseId,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook to get hearing by ID
 */
export const useGetHearingById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.hearings.detail(id),
    queryFn: async () => {
      try {
        return await hearingsApi.getHearingById(id);
      } catch (error) {
        console.error(`Failed to fetch hearing ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

/**
 * Hook to get upcoming hearings
 */
export const useGetUpcomingHearings = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.hearings.upcoming(toQueryParams(params)),
    queryFn: async () => {
      try {
        return await hearingsApi.getUpcomingHearings(params);
      } catch (error) {
        console.error("Failed to fetch upcoming hearings:", error);
        throw error;
      }
    },
  });
};

/**
 * Hook to get today's hearings
 */
export const useGetTodaysHearings = () => {
  return useQuery({
    queryKey: queryKeys.hearings.today,
    queryFn: async () => {
      try {
        return await hearingsApi.getTodaysHearings();
      } catch (error) {
        console.error("Failed to fetch today's hearings:", error);
        throw error;
      }
    },
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
    queryFn: async () => {
      try {
        return await hearingsApi.getHearingsByJudge(judgeId);
      } catch (error) {
        console.error(`Failed to fetch hearings for judge ${judgeId}:`, error);
        throw error;
      }
    },
    enabled: !!judgeId,
  });
};

/**
 * Hook to create hearing
 */
export const useCreateHearing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hearingData: Partial<Hearing>) => {
      try {
        return await hearingsApi.createHearing(hearingData);
      } catch (error) {
        console.error("Failed to create hearing:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing scheduled successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      // Provide specific error messages
      if (statusCode === 404) {
        toast.error(
          "Unable to create hearing. The hearings API endpoint may not be available."
        );
      } else if (statusCode === 400) {
        toast.error(
          message || "Invalid hearing data. Please check your input."
        );
      } else if (statusCode === 403) {
        toast.error("You don't have permission to schedule hearings.");
      } else {
        toast.error(message || "Failed to create hearing. Please try again.");
      }
    },
  });
};

/**
 * Hook to update hearing
 */
export const useUpdateHearing = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hearingData: Partial<Hearing>) => {
      try {
        return await hearingsApi.updateHearing(id, hearingData);
      } catch (error) {
        console.error(`Failed to update hearing ${id}:`, error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      queryClient.setQueryData(queryKeys.hearings.detail(id), data);
      toast.success("Hearing updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update hearing. Please try again.");
    },
  });
};

/**
 * Hook to update hearing status
 */
export const useUpdateHearingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      try {
        return await hearingsApi.updateHearingStatus(id, status);
      } catch (error) {
        console.error(`Failed to update status for hearing ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing status updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update hearing status.");
    },
  });
};

/**
 * Hook to delete hearing
 */
export const useDeleteHearing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await hearingsApi.deleteHearing(id);
      } catch (error) {
        console.error(`Failed to delete hearing ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hearings"] });
      toast.success("Hearing deleted successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message;

      if (statusCode === 403) {
        toast.error("You don't have permission to delete hearings.");
      } else {
        toast.error(message || "Failed to delete hearing.");
      }
    },
  });
};
