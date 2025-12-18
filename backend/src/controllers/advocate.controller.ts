import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import AdvocateService from "@services/advocate.service.js";

// Create advocate
export const createAdvocate = asyncHandler(
  async (req: Request, res: Response) => {
    const advocate = await AdvocateService.createAdvocate(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, advocate, "Advocate created successfully"));
  }
);

// Get all advocates
export const getAllAdvocates = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await AdvocateService.getAllAdvocates(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, data, "Advocates fetched successfully"));
  }
);

// Get advocate by ID
export const getAdvocateById = asyncHandler(
  async (req: Request, res: Response) => {
    const advocate = await AdvocateService.getAdvocateById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, advocate, "Advocate fetched successfully"));
  }
);

// Get advocate by user ID
export const getAdvocateByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const advocate = await AdvocateService.getAdvocateByUserId(
      req.params.userId
    );

    res
      .status(200)
      .json(new ApiResponse(200, advocate, "Advocate fetched successfully"));
  }
);

// Update advocate
export const updateAdvocate = asyncHandler(
  async (req: Request, res: Response) => {
    const advocate = await AdvocateService.updateAdvocate(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, advocate, "Advocate updated successfully"));
  }
);

// Delete advocate
export const deleteAdvocate = asyncHandler(
  async (req: Request, res: Response) => {
    await AdvocateService.deleteAdvocate(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Advocate deleted successfully"));
  }
);

// Get advocates by specialization
export const getAdvocatesBySpecialization = asyncHandler(
  async (req: Request, res: Response) => {
    const advocates = await AdvocateService.getAdvocatesBySpecialization(
      req.params.specialization
    );

    res
      .status(200)
      .json(new ApiResponse(200, advocates, "Advocates fetched successfully"));
  }
);

// Toggle advocate status
export const toggleAdvocateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const advocate = await AdvocateService.toggleAdvocateStatus(req.params.id);

    res
      .status(200)
      .json(
        new ApiResponse(200, advocate, "Advocate status updated successfully")
      );
  }
);

// Get advocate statistics
export const getAdvocateStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await AdvocateService.getAdvocateStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Advocate statistics fetched successfully")
      );
  }
);
