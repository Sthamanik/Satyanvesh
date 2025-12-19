import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import { ApiError } from "@utils/apiError.util.js";
import DocumentService from "@services/document.service.js";

// Upload document
export const uploadDocument = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Document file is required");
    }

    const documentData = await DocumentService.uploadDocument({
      ...req.body,
      uploadedBy: req.user._id,
      filePath: req.file.path,
    });

    res
      .status(201)
      .json(
        new ApiResponse(201, documentData, "Document uploaded successfully")
      );
  }
);

// Get all documents for a case
export const getCaseDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.getCaseDocuments(
      req.params.caseId,
      req.query
    );

    res
      .status(200)
      .json(new ApiResponse(200, documents, "Documents fetched successfully"));
  }
);

// Get document by ID
export const getDocumentById = asyncHandler(
  async (req: Request, res: Response) => {
    const document = await DocumentService.getDocumentById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, document, "Document fetched successfully"));
  }
);

// Get documents by hearing
export const getHearingDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.getHearingDocuments(
      req.params.hearingId
    );

    res
      .status(200)
      .json(new ApiResponse(200, documents, "Documents fetched successfully"));
  }
);

// Get documents by type
export const getDocumentsByType = asyncHandler(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.getDocumentsByType(
      req.params.caseId,
      req.params.type
    );

    res
      .status(200)
      .json(new ApiResponse(200, documents, "Documents fetched successfully"));
  }
);

// Get public documents
export const getPublicDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const documents = await DocumentService.getPublicDocuments(
      req.params.caseId
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, documents, "Public documents fetched successfully")
      );
  }
);

// Update document
export const updateDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const document = await DocumentService.updateDocument(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, document, "Document updated successfully"));
  }
);

// Delete document
export const deleteDocument = asyncHandler(
  async (req: Request, res: Response) => {
    await DocumentService.deleteDocument(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Document deleted successfully"));
  }
);

// Get document statistics
export const getDocumentStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await DocumentService.getDocumentStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Document statistics fetched successfully")
      );
  }
);
