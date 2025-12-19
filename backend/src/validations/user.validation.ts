import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(1, "Full name is required").trim(),
    phone: z.string().optional(),
    role: z
      .enum(["admin", "judge", "lawyer", "litigant", "clerk", "public"])
      .optional()
      .default("public"),
    barCouncilId: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required").trim().optional(),
    phone: z.string().optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
  }),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const getUserBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "judge", "lawyer", "litigant", "clerk", "public"]),
  }),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

export const getAllUsersSchema = z.object({
  query: z.object({
    role: z
      .enum(["admin", "judge", "lawyer", "litigant", "clerk", "public"])
      .optional(),
    isVerified: z.enum(["true", "false"]).optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
  }),
});

export const updateAvatarSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});