import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import CourtService from "@services/court.service.js";

// Create court
export const createCourt = asyncHandler(async (req: Request, res: Response) => {
  const court = await CourtService.createCourt(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, court, "Court created successfully"));
});

// Get all courts
export const getAllCourts = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await CourtService.getAllCourts(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Courts fetched successfully"));
  }
);

// Get court by ID
export const getCourtById = asyncHandler(
  async (req: Request, res: Response) => {
    const court = await CourtService.getCourtById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, court, "Court fetched successfully"));
  }
);

// Get court by slug
export const getCourtBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const court = await CourtService.getCourtBySlug(req.params.slug);

    res
      .status(200)
      .json(new ApiResponse(200, court, "Court fetched successfully"));
  }
);

// Update court
export const updateCourt = asyncHandler(async (req: Request, res: Response) => {
  const court = await CourtService.updateCourt(req.params.id, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, court, "Court updated successfully"));
});

// Delete court
export const deleteCourt = asyncHandler(async (req: Request, res: Response) => {
  await CourtService.deleteCourt(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Court deleted successfully"));
});

// Get courts by type
export const getCourtsByType = asyncHandler(
  async (req: Request, res: Response) => {
    const courts = await CourtService.getCourtsByType(req.params.type);

    res
      .status(200)
      .json(new ApiResponse(200, courts, "Courts fetched successfully"));
  }
);

// Get courts by state
export const getCourtsByState = asyncHandler(
  async (req: Request, res: Response) => {
    const courts = await CourtService.getCourtsByState(req.params.state);

    res
      .status(200)
      .json(new ApiResponse(200, courts, "Courts fetched successfully"));
  }
);

// Toggle court status
export const toggleCourtStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const court = await CourtService.toggleCourtStatus(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, court, "Court status updated successfully"));
  }
);

// Get court statistics
export const getCourtStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CourtService.getCourtStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Court statistics fetched successfully")
      );
  }
);
