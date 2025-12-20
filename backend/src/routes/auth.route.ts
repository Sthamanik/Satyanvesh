import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
} from "@controllers/auth.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT } from "@middlewares/auth.middleware.js";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from "@validations/auth.validation.js";
import { avatarUpload } from "@middlewares/avatarUpload.middleware.js";
import { authLimiter } from "@middlewares/rateLimiter.middleware";

const router = Router();

// Public routes
router.post(
  "/register",
  authLimiter,
  avatarUpload.single("avatar"),
  validate(registerSchema),
  register
);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshAccessToken);

// Protected routes
router.use(verifyJWT);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.post(
  "/change-password",
  authLimiter,
  validate(changePasswordSchema),
  changePassword
);

export default router;
