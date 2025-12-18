import { Router } from "express";
import {
  createAdvocate,
  getAllAdvocates,
  getAdvocateById,
  getAdvocateByUserId,
  updateAdvocate,
  deleteAdvocate,
  getAdvocatesBySpecialization,
  toggleAdvocateStatus,
  getAdvocateStatistics,
} from "@controllers/advocate.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  createAdvocateSchema,
  updateAdvocateSchema,
  getAdvocateByIdSchema,
  getAdvocateByUserIdSchema,
  deleteAdvocateSchema,
  getAllAdvocatesSchema,
} from "@validations/advocate.validation.js";

const router = Router();

// Public routes
router.get("/", validate(getAllAdvocatesSchema), getAllAdvocates);

router.get(
  "/user/:userId",
  validate(getAdvocateByUserIdSchema),
  getAdvocateByUserId
);

router.get("/specialization/:specialization", getAdvocatesBySpecialization);

router.get("/:id", validate(getAdvocateByIdSchema), getAdvocateById);

router.use(verifyJWT, authorizeRoles("admin"));
// Admin only routes
router.post(
  "/",
  validate(createAdvocateSchema),
  createAdvocate
);

router.patch(
  "/:id",
  validate(updateAdvocateSchema),
  updateAdvocate
);

router.delete(
  "/:id",
  validate(deleteAdvocateSchema),
  deleteAdvocate
);

router.patch(
  "/:id/toggle-status",
  toggleAdvocateStatus
);

router.get(
  "/statistics",
  getAdvocateStatistics
);

export default router;
