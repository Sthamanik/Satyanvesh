import { z } from "zod";

export const createCaseTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Case type name is required").trim(),
    code: z
      .string()
      .min(2, "Case type code must be at least 2 characters")
      .max(10, "Case type code must be at most 10 characters")
      .toUpperCase()
      .trim(),
    description: z.string().trim().optional(),
    category: z.enum(["Civil", "Criminal", "Family", "Constitutional"]),
  }),
});

export const updateCaseTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Case type name is required").trim().optional(),
    code: z
      .string()
      .min(2, "Case type code must be at least 2 characters")
      .max(10, "Case type code must be at most 10 characters")
      .toUpperCase()
      .trim()
      .optional(),
    description: z.string().trim().optional(),
    category: z.enum(["Civil", "Criminal", "Family", "Constitutional"]).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Case type ID is required"),
  }),
});

export const getCaseTypeByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case type ID is required"),
  }),
});

export const getCaseTypeBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export const deleteCaseTypeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case type ID is required"),
  }),
});

export const getAllCaseTypesSchema = z.object({
  query: z.object({
    category: z.enum(["Civil", "Criminal", "Family", "Constitutional"]).optional(),
    isActive: z.enum(["true", "false"]).optional(),
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
