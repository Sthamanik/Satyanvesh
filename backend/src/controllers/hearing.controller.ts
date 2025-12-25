import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import HearingService from "@services/hearing.service.js";

// Create hearing
export const createHearing = asyncHandler(
  async (req: Request, res: Response) => {
    const hearing = await HearingService.createHearing(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, hearing, "Hearing created successfully"));
  }
);

// Get all hearings for a case
export const getCaseHearings = asyncHandler(
  async (req: Request, res: Response) => {
    const hearings = await HearingService.getCaseHearings(req.params.caseId);

    res
      .status(200)
      .json(new ApiResponse(200, hearings, "Hearings fetched successfully"));
  }
);

// Get hearing by ID
export const getHearingById = asyncHandler(
  async (req: Request, res: Response) => {
    const hearing = await HearingService.getHearingById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, hearing, "Hearing fetched successfully"));
  }
);

// Get all hearings
export const getAllHearings = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await HearingService.getAllHearings(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Hearings fetched successfully"));
  }
);

// Get upcoming hearings
export const getUpcomingHearings = asyncHandler(
  async (req: Request, res: Response) => {
    const hearings = await HearingService.getUpcomingHearings(req.query);

    res
      .status(200)
      .json(
        new ApiResponse(200, hearings, "Upcoming hearings fetched successfully")
      );
  }
);

// Get hearings by judge
export const getHearingsByJudge = asyncHandler(
  async (req: Request, res: Response) => {
    const hearings = await HearingService.getHearingsByJudge(
      req.params.judgeId
    );

    res
      .status(200)
      .json(new ApiResponse(200, hearings, "Hearings fetched successfully"));
  }
);

// Get today's hearings
export const getTodaysHearings = asyncHandler(
  async (req: Request, res: Response) => {
    const { judgeId } = req.query;
    const hearings = await HearingService.getTodaysHearings(judgeId as string);

    res
      .status(200)
      .json(
        new ApiResponse(200, hearings, "Today's hearings fetched successfully")
      );
  }
);

// Update hearing
export const updateHearing = asyncHandler(
  async (req: Request, res: Response) => {
    const hearing = await HearingService.updateHearing(req.params.id, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, hearing, "Hearing updated successfully"));
  }
);

// Update hearing status
export const updateHearingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const hearing = await HearingService.updateHearingStatus(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, hearing, "Hearing status updated successfully")
      );
  }
);

// Delete hearing
export const deleteHearing = asyncHandler(
  async (req: Request, res: Response) => {
    await HearingService.deleteHearing(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Hearing deleted successfully"));
  }
);

// Get hearing statistics
export const getHearingStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await HearingService.getHearingStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Hearing statistics fetched successfully")
      );
  }
);