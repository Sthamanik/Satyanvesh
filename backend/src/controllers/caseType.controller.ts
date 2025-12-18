import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import CaseTypeService from "@services/caseType.service.js";

// Create case type
export const createCaseType = asyncHandler(
  async (req: Request, res: Response) => {
    const caseType = await CaseTypeService.createCaseType(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, caseType, "Case type created successfully"));
  }
);

// Get all case types
export const getAllCaseTypes = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CaseTypeService.getAllCaseTypes(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Case types fetched successfully"));
  }
);

// Get case type by ID
export const getCaseTypeById = asyncHandler(
  async (req: Request, res: Response) => {
    const caseType = await CaseTypeService.getCaseTypeById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, caseType, "Case type fetched successfully"));
  }
);

// Get case type by slug
export const getCaseTypeBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const caseType = await CaseTypeService.getCaseTypeBySlug(req.params.slug);

    res
      .status(200)
      .json(new ApiResponse(200, caseType, "Case type fetched successfully"));
  }
);

// Update case type
export const updateCaseType = asyncHandler(
  async (req: Request, res: Response) => {
    const caseType = await CaseTypeService.updateCaseType(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, caseType, "Case type updated successfully"));
  }
);

// Delete case type
export const deleteCaseType = asyncHandler(
  async (req: Request, res: Response) => {
    await CaseTypeService.deleteCaseType(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Case type deleted successfully"));
  }
);

// Get case types by category
export const getCaseTypesByCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const caseTypes = await CaseTypeService.getCaseTypesByCategory(
      req.params.category
    );

    res
      .status(200)
      .json(new ApiResponse(200, caseTypes, "Case types fetched successfully"));
  }
);

// Toggle case type status
export const toggleCaseTypeStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const caseType = await CaseTypeService.toggleCaseTypeStatus(req.params.id);

    res
      .status(200)
      .json(
        new ApiResponse(200, caseType, "Case type status updated successfully")
      );
  }
);

// Get case type statistics
export const getCaseTypeStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CaseTypeService.getCaseTypeStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Case type statistics fetched successfully")
      );
  }
);
