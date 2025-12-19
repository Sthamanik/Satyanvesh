import { z } from "zod";

export const addBookmarkSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    notes: z.string().trim().optional(),
  }),
});

export const updateBookmarkSchema = z.object({
  body: z.object({
    notes: z.string().trim().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Bookmark ID is required"),
  }),
});

export const getBookmarkByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bookmark ID is required"),
  }),
});

export const removeBookmarkSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Bookmark ID is required"),
  }),
});

export const checkBookmarkSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
  }),
});
