import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import CasePartyService from "@services/caseParty.service.js";

// Add party to case
export const addCaseParty = asyncHandler(
  async (req: Request, res: Response) => {
    const party = await CasePartyService.addCaseParty(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, party, "Case party added successfully"));
  }
);

// Get all parties for a case
export const getCaseParties = asyncHandler(
  async (req: Request, res: Response) => {
    const parties = await CasePartyService.getCaseParties(req.params.caseId);

    res
      .status(200)
      .json(new ApiResponse(200, parties, "Case parties fetched successfully"));
  }
);

// Get party by ID
export const getCasePartyById = asyncHandler(
  async (req: Request, res: Response) => {
    const party = await CasePartyService.getCasePartyById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, party, "Case party fetched successfully"));
  }
);

// Get parties by type
export const getPartiesByType = asyncHandler(
  async (req: Request, res: Response) => {
    const parties = await CasePartyService.getPartiesByType(
      req.params.caseId,
      req.params.partyType
    );

    res
      .status(200)
      .json(new ApiResponse(200, parties, "Case parties fetched successfully"));
  }
);

// Get parties by advocate
export const getPartiesByAdvocate = asyncHandler(
  async (req: Request, res: Response) => {
    const parties = await CasePartyService.getPartiesByAdvocate(
      req.params.advocateId
    );

    res
      .status(200)
      .json(new ApiResponse(200, parties, "Case parties fetched successfully"));
  }
);

// Update case party
export const updateCaseParty = asyncHandler(
  async (req: Request, res: Response) => {
    const party = await CasePartyService.updateCaseParty(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, party, "Case party updated successfully"));
  }
);

// Delete case party
export const deleteCaseParty = asyncHandler(
  async (req: Request, res: Response) => {
    await CasePartyService.deleteCaseParty(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Case party deleted successfully"));
  }
);

// Get case party statistics
export const getCasePartyStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CasePartyService.getCasePartyStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          stats,
          "Case party statistics fetched successfully"
        )
      );
  }
);
