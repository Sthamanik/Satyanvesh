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
} from "@validations/user.validation.js";

const router = Router();

// Public Routes
router.get("/slug/:slug", validate(getUserBySlugSchema), getUserBySlug);

router.get("/role/:role", getUsersByRole);

router.get("/:id", validate(getUserByIdSchema), getUserById);

// Protected ROutes
router.use(verifyJWT);

router.get("/", validate(getAllUsersSchema), getAllUsers);

router.patch("/:id", validate(updateUserSchema), updateUser);

// Admin only routes
router.use(authorizeRoles("admin"));
router.post("/", validate(createUserSchema), createUser);

router.patch("/:id/role", validate(updateUserRoleSchema), updateUserRole);

router.patch("/:id/verify", validate(verifyUserSchema), verifyUser);

router.delete("/:id", validate(deleteUserSchema), deleteUser);

router.get("/statistics", getUserStatistics);

export default router;
