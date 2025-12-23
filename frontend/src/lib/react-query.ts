import { QueryClient } from "@tanstack/react-query";
import type { DefaultOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

// Custom error handler
const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred");
  }
};

// Default options for React Query
const queryConfig: DefaultOptions = {
  queries: {
    // Throw errors instead of storing them in error state
    // This allows error boundaries to catch them
    throwOnError: true,
    // Refetch on window focus (disabled for better UX)
    refetchOnWindowFocus: false,

    // Retry failed requests (1 retry by default)
    retry: 1,

    // Stale time - data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
  mutations: {
    // Throw errors for mutations too
    throwOnError: true,

    // Global error handler for mutations
    onError: handleError,
  },
};

// Create query client
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
