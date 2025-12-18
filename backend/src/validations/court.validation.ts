import { z } from "zod";

export const createCourtSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Court name is required").trim(),
    code: z
      .string()
      .min(2, "Court code must be at least 2 characters")
      .max(10, "Court code must be at most 10 characters")
      .toUpperCase()
      .trim(),
    type: z.enum(["Supreme", "High", "District", "Magistrate"]),
    state: z.string().min(1, "State is required").trim(),
    city: z.string().min(1, "City is required").trim(),
    address: z.string().min(1, "Address is required").trim(),
    contactEmail: z.string().email("Invalid email address").optional(),
    contactPhone: z.string().optional(),
  }),
});

export const updateCourtSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Court name is required").trim().optional(),
    code: z
      .string()
      .min(2, "Court code must be at least 2 characters")
      .max(10, "Court code must be at most 10 characters")
      .toUpperCase()
      .trim()
      .optional(),
    type: z.enum(["Supreme", "High", "District", "Magistrate"]).optional(),
    state: z.string().min(1, "State is required").trim().optional(),
    city: z.string().min(1, "City is required").trim().optional(),
    address: z.string().min(1, "Address is required").trim().optional(),
    contactEmail: z.string().email("Invalid email address").optional(),
    contactPhone: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Court ID is required"),
  }),
});

export const getCourtByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Court ID is required"),
  }),
});

export const getCourtBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export const deleteCourtSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Court ID is required"),
  }),
});

export const getAllCourtsSchema = z.object({
  query: z.object({
    type: z.enum(["Supreme", "High", "District", "Magistrate"]).optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    isActive: z.enum(["true", "false"]).optional(),
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
