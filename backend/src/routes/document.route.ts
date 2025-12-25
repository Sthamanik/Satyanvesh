import { Router } from "express";
import {
  uploadDocument,
  getCaseDocuments,
  getDocumentById,
  getHearingDocuments,
  getDocumentsByType,
  getPublicDocuments,
  updateDocument,
  deleteDocument,
  getDocumentStatistics,
} from "@controllers/document.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import { upload } from "@middlewares/upload.middleware.js";
import {
  uploadDocumentSchema,
  updateDocumentSchema,
  getDocumentByIdSchema,
  deleteDocumentSchema,
  getCaseDocumentsSchema,
} from "@validations/document.validation.js";
import { readLimiter, uploadLimiter } from "@middlewares/rateLimiter.middleware";

const router = Router();

// Public routes with route limiter
router.get("/case/:caseId", readLimiter, validate(getCaseDocumentsSchema), getCaseDocuments);

router.get("/case/:caseId/public", readLimiter, getPublicDocuments);

router.get("/case/:caseId/type/:type", readLimiter, getDocumentsByType);

router.get("/hearing/:hearingId", readLimiter, getHearingDocuments);



router.get("/:id", readLimiter, validate(getDocumentByIdSchema), getDocumentById);

// Admin/Judge/Clerk/Lawyer routes
router.use(verifyJWT);
router.post(
  "/upload",
  authorizeRoles("admin", "judge", "clerk", "lawyer"),
  uploadLimiter,
  upload.single("document"),
  validate(uploadDocumentSchema),
  uploadDocument
);

router.patch(
  "/:id",
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateDocumentSchema),
  updateDocument
);

router.delete(
  "/:id",
  authorizeRoles("admin", "judge", "clerk"),
  validate(deleteDocumentSchema),
  deleteDocument
);

router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getDocumentStatistics
);

export default router;
