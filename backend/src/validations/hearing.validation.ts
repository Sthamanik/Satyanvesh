import { z } from "zod";

export const createHearingSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    hearingNumber: z.string().min(1, "Hearing number is required").trim(),
    hearingDate: z.string().or(z.date()),
    hearingTime: z.string().min(1, "Hearing time is required"),
    judgeId: z.string().min(1, "Judge ID is required"),
    courtRoom: z.string().trim().optional(),
    purpose: z.enum([
      "preliminary",
      "evidence",
      "argument",
      "judgment",
      "mention",
    ]),
  }),
});

export const updateHearingSchema = z.object({
  body: z.object({
    hearingNumber: z
      .string()
      .min(1, "Hearing number is required")
      .trim()
      .optional(),
    hearingDate: z.string().or(z.date()).optional(),
    hearingTime: z.string().min(1, "Hearing time is required").optional(),
    judgeId: z.string().min(1, "Judge ID is required").optional(),
    courtRoom: z.string().trim().optional(),
    purpose: z
      .enum(["preliminary", "evidence", "argument", "judgment", "mention"])
      .optional(),
    status: z
      .enum(["scheduled", "ongoing", "completed", "adjourned", "cancelled"])
      .optional(),
    notes: z.string().trim().optional(),
    nextHearingDate: z.string().or(z.date()).optional(),
    adjournmentReason: z.string().trim().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Hearing ID is required"),
  }),
});

export const getHearingByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Hearing ID is required"),
  }),
});

export const deleteHearingSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Hearing ID is required"),
  }),
});

export const getCaseHearingsSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
  }),
});

export const updateHearingStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "scheduled",
      "ongoing",
      "completed",
      "adjourned",
      "cancelled",
    ]),
    notes: z.string().trim().optional(),
    nextHearingDate: z.string().or(z.date()).optional(),
    adjournmentReason: z.string().trim().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Hearing ID is required"),
  }),
});

export const getUpcomingHearingsSchema = z.object({
  query: z.object({
    judgeId: z.string().optional(),
    courtId: z.string().optional(),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
