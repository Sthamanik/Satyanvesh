import { z } from "zod";

export const trackCaseViewSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
  }),
});

export const getCaseViewAnalyticsSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
  }),
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const getTrendingCasesSchema = z.object({
  query: z.object({
    days: z.string().regex(/^\d+$/).optional().default("7"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
