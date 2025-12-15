import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
} from "@controllers/auth.controller";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT } from "@middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from "@validations/auth.validation";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refreshAccessToken);

// Protected routes
router.use(verifyJWT);
router.post("/logout", logout);
router.get("/me", getCurrentUser);
router.post(
  "/change-password",
  validate(changePasswordSchema),
  changePassword
);

export default router;
