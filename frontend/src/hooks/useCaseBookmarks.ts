import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { caseBookmarksApi } from "@/api/caseBookmarks.api";
import { queryKeys } from "@/lib/react-query";
import type {
  ApiResponse,
  CaseBookmark,
  SearchParams,
} from "@/types/api.types";
import type { AxiosError } from "axios";

/**
 * Hook to get user's bookmarks
 */
export const useGetUserBookmarks = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.bookmarks.myBookmarks,
    queryFn: () => caseBookmarksApi.getUserBookmarks(params),
  });
};

/**
 * Hook to get bookmarks with upcoming hearings
 */
export const useGetBookmarksWithUpcomingHearings = (params?: SearchParams) => {
  return useQuery({
    queryKey: queryKeys.bookmarks.upcomingHearings,
    queryFn: () => caseBookmarksApi.getBookmarksWithUpcomingHearings(params),
  });
};

/**
 * Hook to check if case is bookmarked
 */
export const useCheckBookmark = (caseId: string) => {
  return useQuery({
    queryKey: queryKeys.bookmarks.check(caseId),
    queryFn: () => caseBookmarksApi.checkBookmark(caseId),
    enabled: !!caseId,
  });
};

/**
 * Hook to get bookmark by ID
 */
export const useGetBookmarkById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bookmarks.detail(id),
    queryFn: () => caseBookmarksApi.getBookmarkById(id),
    enabled: !!id,
  });
};

/**
 * Hook to add bookmark
 */
export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      notes,
    }: {
      caseId: string;
      notes?: string;
    }) => {
      return await caseBookmarksApi.addBookmark(caseId, notes);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.setQueryData(
        queryKeys.bookmarks.check(variables.caseId),
        { data: { isBookmarked: true, bookmark: data.data } }
      );
      toast.success("Case bookmarked successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to bookmark case");
    },
  });
};

/**
 * Hook to update bookmark
 */
export const useUpdateBookmark = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { notes?: string }) => {
      return await caseBookmarksApi.updateBookmark(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.setQueryData(queryKeys.bookmarks.detail(id), data);
      toast.success("Bookmark updated successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to update bookmark");
    },
  });
};

/**
 * Hook to remove bookmark
 */
export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await caseBookmarksApi.removeBookmark(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success("Bookmark removed successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to remove bookmark");
    },
  });
};

/**
 * Hook to remove bookmark by case ID
 */
export const useRemoveBookmarkByCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      return await caseBookmarksApi.removeBookmarkByCase(caseId);
    },
    onSuccess: (_, caseId) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.setQueryData(queryKeys.bookmarks.check(caseId), {
        data: { isBookmarked: false },
      });
      toast.success("Bookmark removed successfully");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      const message = error.response?.data?.message;
      toast.error(message || "Failed to remove bookmark");
    },
  });
};

