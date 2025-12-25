import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import { ApiError } from "@utils/apiError.util.js";
import CaseService from "@services/case.service.js";

// Create case
export const createCase = asyncHandler(async (req: Request, res: Response) => {
  const caseData = await CaseService.createCase({
    ...req.body,
    filedBy: req.user?._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, caseData, "Case created successfully"));
});

// Get all cases
export const getAllCases = asyncHandler(async (req: Request, res: Response) => {
  const data = await CaseService.getAllCases(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, data, "Cases fetched successfully"));
});

// Get case by ID
export const getCaseById = asyncHandler(async (req: Request, res: Response) => {
  const caseData = await CaseService.getCaseById(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, caseData, "Case fetched successfully"));
});

// Get case by slug
export const getCaseBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const caseData = await CaseService.getCaseBySlug(req.params.slug);

    res
      .status(200)
      .json(new ApiResponse(200, caseData, "Case fetched successfully"));
  }
);

// Get case by case number
export const getCaseByCaseNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const caseData = await CaseService.getCaseByCaseNumber(
      req.params.caseNumber
    );

    res
      .status(200)
      .json(new ApiResponse(200, caseData, "Case fetched successfully"));
  }
);

// Update case
export const updateCase = asyncHandler(async (req: Request, res: Response) => {
  const caseData = await CaseService.updateCase(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, caseData, "Case updated successfully"));
});

// Update case status
export const updateCaseStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const caseData = await CaseService.updateCaseStatus(
      req.params.id,
      req.body.status
    );

    res
      .status(200)
      .json(new ApiResponse(200, caseData, "Case status updated successfully"));
  }
);

// Delete case
export const deleteCase = asyncHandler(async (req: Request, res: Response) => {
  await CaseService.deleteCase(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "Case deleted successfully"));
});

// Get cases by court
export const getCasesByCourt = asyncHandler(
  async (req: Request, res: Response) => {
    const cases = await CaseService.getCasesByCourt(req.params.courtId);

    res
      .status(200)
      .json(new ApiResponse(200, cases, "Cases fetched successfully"));
  }
);

// Get cases by case type
export const getCasesByCaseType = asyncHandler(
  async (req: Request, res: Response) => {
    const cases = await CaseService.getCasesByCaseType(req.params.caseTypeId);

    res
      .status(200)
      .json(new ApiResponse(200, cases, "Cases fetched successfully"));
  }
);

// Get cases by user
export const getCasesByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const cases = await CaseService.getCasesByUser(req.params.userId);

    res
      .status(200)
      .json(new ApiResponse(200, cases, "Cases fetched successfully"));
  }
);

// Search cases
export const searchCases = asyncHandler(async (req: Request, res: Response) => {
  const { query, page, limit } = req.query;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const data = await CaseService.searchCases(
    query as string,
    page as string,
    limit as string
  );

  res
    .status(200)
    .json(new ApiResponse(200, data, "Cases searched successfully"));
});

// Get case statistics
export const getCaseStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CaseService.getCaseStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Case statistics fetched successfully")
      );
  }
);

// Get cases asssrigned to me
export const getMyCases = asyncHandler(async (req: Request, res: Response) => {
  const data = await CaseService.getMyCases(
    req.user!._id,
    req.user!.role,
    req.query
  );

  res
    .status(200)
    .json(new ApiResponse(200, data, "My cases fetched successfully"));
});
