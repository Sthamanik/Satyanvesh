import { QueryClient } from "@tanstack/react-query";
import type { DefaultOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

// Custom error handler with better error messages
const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message;

    // Handle specific error codes
    switch (statusCode) {
      case 400:
        toast.error(errorMessage || "Bad request. Please check your input.");
        break;
      case 401:
        toast.error("Your session has expired. Please log in again.");
        // Optionally redirect to login
        // window.location.href = '/login';
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 404:
        toast.error(
          errorMessage || "The requested resource could not be found."
        );
        break;
      case 429:
        toast.error("Too many requests. Please wait a moment and try again.");
        break;
      case 500:
        toast.error(
          "Server error. Our team has been notified. Please try again later."
        );
        break;
      case 503:
        toast.error("Service temporarily unavailable. Please try again later.");
        break;
      default:
        // Network error or unknown error
        if (!statusCode) {
          console.error("Network error:", error);
          // Don't show toast for network errors - let components handle it
          return;
        }
        toast.error(errorMessage || "An unexpected error occurred.");
    }
  } else if (error instanceof Error) {
    // Generic JavaScript error
    toast.error(error.message || "An unexpected error occurred.");
  } else {
    // Unknown error type
    toast.error("An unexpected error occurred.");
  }
};

// Default options for React Query with improved error handling
const queryConfig: DefaultOptions = {
  queries: {
    // Don't throw errors - let components handle them gracefully
    throwOnError: false,

    // Refetch on window focus (disabled for better UX)
    refetchOnWindowFocus: false,

    // Retry failed requests with exponential backoff
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500) {
          return false; // Don't retry client errors
        }
      }

      // Retry up to 2 times for server errors or network errors
      return failureCount < 2;
    },

    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Stale time - data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time - data stays in cache for 30 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  },
  mutations: {
    // Don't throw errors for mutations
    throwOnError: false,

    // Global error handler for mutations
    onError: handleError,

    // Retry mutations once on network errors
    retry: (failureCount, error) => {
      // Only retry on network errors
      if (error instanceof AxiosError && !error.response) {
        return failureCount < 1;
      }
      return false;
    },
  },
};

// Create query client with custom configuration
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys for better organization and type safety
export const queryKeys = {
  // Auth
  auth: {
    me: ["auth", "me"] as const,
  },

  // Users
  users: {
    all: (params?: Record<string, unknown>) =>
      ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
    bySlug: (slug: string) => ["users", "slug", slug] as const,
    byRole: (role: string) => ["users", "role", role] as const,
    statistics: ["users", "statistics"] as const,
  },

  // Cases
  cases: {
    all: (params?: Record<string, unknown>) =>
      ["cases", "list", params] as const,
    detail: (id: string) => ["cases", "detail", id] as const,
    bySlug: (slug: string) => ["cases", "slug", slug] as const,
    byCaseNumber: (caseNumber: string) =>
      ["cases", "case-number", caseNumber] as const,
    byCourt: (courtId: string) => ["cases", "court", courtId] as const,
    byCaseType: (caseTypeId: string) =>
      ["cases", "case-type", caseTypeId] as const,
    byUser: (userId: string) => ["cases", "user", userId] as const,
    search: (query: string) => ["cases", "search", query] as const,
    statistics: ["cases", "statistics"] as const,
  },

  // Courts
  courts: {
    all: (params?: Record<string, unknown>) =>
      ["courts", "list", params] as const,
    detail: (id: string) => ["courts", "detail", id] as const,
    bySlug: (slug: string) => ["courts", "slug", slug] as const,
    byType: (type: string) => ["courts", "type", type] as const,
    byState: (state: string) => ["courts", "state", state] as const,
    statistics: ["courts", "statistics"] as const,
  },

  // Case Types
  caseTypes: {
    all: (params?: Record<string, unknown>) =>
      ["case-types", "list", params] as const,
    detail: (id: string) => ["case-types", "detail", id] as const,
    bySlug: (slug: string) => ["case-types", "slug", slug] as const,
    byCategory: (category: string) =>
      ["case-types", "category", category] as const,
    statistics: ["case-types", "statistics"] as const,
  },

  // Advocates
  advocates: {
    all: (params?: Record<string, unknown>) =>
      ["advocates", "list", params] as const,
    detail: (id: string) => ["advocates", "detail", id] as const,
    byUser: (userId: string) => ["advocates", "user", userId] as const,
    bySpecialization: (specialization: string) =>
      ["advocates", "specialization", specialization] as const,
    statistics: ["advocates", "statistics"] as const,
  },

  // Hearings
  hearings: {
    all: (params?: Record<string, unknown>) =>
      ["hearings", "list", params] as const,
    detail: (id: string) => ["hearings", "detail", id] as const,
    byCase: (caseId: string) => ["hearings", "case", caseId] as const,
    byJudge: (judgeId: string) => ["hearings", "judge", judgeId] as const,
    upcoming: (params?: Record<string, unknown>) =>
      ["hearings", "upcoming", params] as const,
    today: ["hearings", "today"] as const,
    statistics: ["hearings", "statistics"] as const,
  },

  // Documents
  documents: {
    all: (params?: Record<string, unknown>) =>
      ["documents", "list", params] as const,
    detail: (id: string) => ["documents", "detail", id] as const,
    byCase: (caseId: string) => ["documents", "case", caseId] as const,
    byHearing: (hearingId: string) =>
      ["documents", "hearing", hearingId] as const,
    byType: (caseId: string, type: string) =>
      ["documents", "case", caseId, "type", type] as const,
    public: (caseId: string) =>
      ["documents", "case", caseId, "public"] as const,
    statistics: ["documents", "statistics"] as const,
  },

  // Case Parties
  caseParties: {
    all: (params?: Record<string, unknown>) =>
      ["case-parties", "list", params] as const,
    detail: (id: string) => ["case-parties", "detail", id] as const,
    byCase: (caseId: string) => ["case-parties", "case", caseId] as const,
    byType: (caseId: string, type: string) =>
      ["case-parties", "case", caseId, "type", type] as const,
    byAdvocate: (advocateId: string) =>
      ["case-parties", "advocate", advocateId] as const,
    statistics: ["case-parties", "statistics"] as const,
  },

  // Case Bookmarks
  bookmarks: {
    all: (params?: Record<string, unknown>) =>
      ["bookmarks", "list", params] as const,
    detail: (id: string) => ["bookmarks", "detail", id] as const,
    myBookmarks: ["bookmarks", "my-bookmarks"] as const,
    upcomingHearings: ["bookmarks", "upcoming-hearings"] as const,
    myStatistics: ["bookmarks", "my-statistics"] as const,
    check: (caseId: string) => ["bookmarks", "check", caseId] as const,
    statistics: ["bookmarks", "statistics"] as const,
  },

  // Case Views
  caseViews: {
    analytics: (caseId: string) => ["case-views", "analytics", caseId] as const,
    trending: (params?: Record<string, unknown>) =>
      ["case-views", "trending", params] as const,
    myViewedCases: ["case-views", "my-viewed-cases"] as const,
    mostViewed: ["case-views", "most-viewed"] as const,
    overallStatistics: ["case-views", "statistics", "overall"] as const,
    dateRangeStatistics: (params?: Record<string, unknown>) =>
      ["case-views", "statistics", "date-range", params] as const,
    peakHours: ["case-views", "statistics", "peak-hours"] as const,
  },
} as const;
