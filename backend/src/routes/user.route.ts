import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserBySlug,
  updateUser,
  updateUserRole,
  verifyUser,
  deleteUser,
  getUsersByRole,
  getUserStatistics,
  updateAvatar,
  removeAvatar
} from "@controllers/user.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  getUserBySlugSchema,
  deleteUserSchema,
  updateUserRoleSchema,
  verifyUserSchema,
  getAllUsersSchema,
  updateAvatarSchema
} from "@validations/user.validation.js";
import { avatarUpload } from "@middlewares/avatarUpload.middleware";
import { readLimiter, uploadLimiter } from "@middlewares/rateLimiter.middleware";

const router = Router();

// Public Routes
router.get("/slug/:slug", readLimiter, validate(getUserBySlugSchema), getUserBySlug);

router.get("/role/:role", readLimiter, getUsersByRole);

router.get("/:id", readLimiter, validate(getUserByIdSchema), getUserById);

// Protected ROutes
router.use(verifyJWT);

router.get("/", readLimiter, validate(getAllUsersSchema), getAllUsers);

router.patch("/:id", validate(updateUserSchema), updateUser);

// Avatar routes
router.patch(
  "/:id/avatar",
  uploadLimiter,
  avatarUpload.single("avatar"),
  validate(updateAvatarSchema),
  updateAvatar
);

router.delete(
  "/:id/avatar",
  validate(updateAvatarSchema),
  removeAvatar
);

// Admin only routes
router.use(authorizeRoles("admin"));
router.post("/", validate(createUserSchema), createUser);

router.patch("/:id/role", validate(updateUserRoleSchema), updateUserRole);

router.patch("/:id/verify", validate(verifyUserSchema), verifyUser);

router.delete("/:id", validate(deleteUserSchema), deleteUser);

router.get("/statistics", getUserStatistics);

export default router;
