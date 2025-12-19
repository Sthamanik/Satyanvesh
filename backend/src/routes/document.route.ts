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

const router = Router();

// Public routes
router.get("/case/:caseId", validate(getCaseDocumentsSchema), getCaseDocuments);

router.get("/case/:caseId/public", getPublicDocuments);

router.get("/case/:caseId/type/:type", getDocumentsByType);

router.get("/hearing/:hearingId", getHearingDocuments);

router.get("/:id", validate(getDocumentByIdSchema), getDocumentById);

// Admin/Judge/Clerk/Lawyer routes
router.post(
  "/upload",
  verifyJWT,
  authorizeRoles("admin", "judge", "clerk", "lawyer"),
  upload.single("document"),
  validate(uploadDocumentSchema),
  uploadDocument
);

router.patch(
  "/:id",
  verifyJWT,
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateDocumentSchema),
  updateDocument
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("admin", "judge", "clerk"),
  validate(deleteDocumentSchema),
  deleteDocument
);

router.get(
  "/statistics",
  verifyJWT,
  authorizeRoles("admin", "judge"),
  getDocumentStatistics
);

export default router;
