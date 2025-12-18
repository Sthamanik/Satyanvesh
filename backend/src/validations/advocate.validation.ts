import { z } from "zod";

export const createAdvocateSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    barCouncilId: z
      .string()
      .min(1, "Bar Council ID is required")
      .toUpperCase()
      .trim(),
    licenseNumber: z
      .string()
      .min(1, "License number is required")
      .toUpperCase()
      .trim(),
    specialization: z.array(z.string()).default([]),
    experience: z.number().min(0, "Experience cannot be negative"),
    firmName: z.string().trim().optional(),
    firmAddress: z.string().trim().optional(),
    enrollmentDate: z.string().or(z.date()),
  }),
});

export const updateAdvocateSchema = z.object({
  body: z.object({
    barCouncilId: z
      .string()
      .min(1, "Bar Council ID is required")
      .toUpperCase()
      .trim()
      .optional(),
    licenseNumber: z
      .string()
      .min(1, "License number is required")
      .toUpperCase()
      .trim()
      .optional(),
    specialization: z.array(z.string()).optional(),
    experience: z.number().min(0, "Experience cannot be negative").optional(),
    firmName: z.string().trim().optional(),
    firmAddress: z.string().trim().optional(),
    enrollmentDate: z.string().or(z.date()).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Advocate ID is required"),
  }),
});

export const getAdvocateByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Advocate ID is required"),
  }),
});

export const getAdvocateByUserIdSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});

export const deleteAdvocateSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Advocate ID is required"),
  }),
});

export const getAllAdvocatesSchema = z.object({
  query: z.object({
    isActive: z.enum(["true", "false"]).optional(),
    specialization: z.string().optional(),
    minExperience: z.string().regex(/^\d+$/).optional(),
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});
