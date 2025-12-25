import { z } from "zod";

export const createCaseSchema = z.object({
  body: z.object({
    caseNumber: z.string().min(1, "Case number is required").toUpperCase().trim(),
    title: z.string().min(1, "Case title is required").trim(),
    description: z.string().trim().optional(),
    caseTypeId: z.string().min(1, "Case type ID is required"),
    courtId: z.string().min(1, "Court ID is required"),
    // filedBy is handled by the controller from req.user
    filingDate: z.string().or(z.date()),
    priority: z.enum(["normal", "urgent", "high"]).optional().default("normal"),
    isPublic: z.boolean().optional().default(true),
    isSensitive: z.boolean().optional().default(false),
  }),
});

export const updateCaseSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Case title is required").trim().optional(),
    description: z.string().trim().optional(),
    caseTypeId: z.string().min(1, "Case type ID is required").optional(),
    courtId: z.string().min(1, "Court ID is required").optional(),
    status: z.enum(["filed", "admitted", "hearing", "judgment", "closed", "archived"]).optional(),
    admissionDate: z.string().or(z.date()).optional(),
    judgmentDate: z.string().or(z.date()).optional(),
    priority: z.enum(["normal", "urgent", "high"]).optional(),
    stage: z.enum(["preliminary", "trial", "final"]).optional(),
    nextHearingDate: z.string().or(z.date()).optional(),
    isPublic: z.boolean().optional(),
    isSensitive: z.boolean().optional(),
    verdict: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Case ID is required"),
  }),
});

export const getCaseByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case ID is required"),
  }),
});

export const getCaseBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export const getCaseByCaseNumberSchema = z.object({
  params: z.object({
    caseNumber: z.string().min(1, "Case number is required"),
  }),
});

export const deleteCaseSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case ID is required"),
  }),
});

export const updateCaseStatusSchema = z.object({
  body: z.object({
    status: z.enum(["filed", "admitted", "hearing", "judgment", "closed", "archived"]),
  }),
  params: z.object({
    id: z.string().min(1, "Case ID is required"),
  }),
});

export const getAllCasesSchema = z.object({
  query: z.object({
    status: z.enum(["filed", "admitted", "hearing", "judgment", "closed", "archived"]).optional(),
    courtId: z.string().optional(),
    caseTypeId: z.string().optional(),
    priority: z.enum(["normal", "urgent", "high"]).optional(),
    stage: z.enum(["preliminary", "trial", "final"]).optional(),
    isPublic: z.enum(["true", "false"]).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
