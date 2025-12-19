import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import CaseViewService from "@services/caseView.service.js";
import { ApiError } from "@utils/apiError.util.js";

// Track case view
export const trackCaseView = asyncHandler(
  async (req: Request, res: Response) => {
    await CaseViewService.trackCaseView({
      userId: req.user?._id,
      caseId: req.body.caseId,
      ipAddress: req.ip || req.body.ipAddress,
      userAgent: req.headers["user-agent"] || req.body.userAgent,
    });

    res
      .status(201)
      .json(new ApiResponse(201, null, "Case view tracked successfully"));
  }
);

// Get case view analytics
export const getCaseViewAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await CaseViewService.getCaseViewAnalytics(
      req.params.caseId,
      req.query
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          analytics,
          "Case view analytics fetched successfully"
        )
      );
  }
);

// Get trending cases
export const getTrendingCases = asyncHandler(
  async (req: Request, res: Response) => {
    const trendingCases = await CaseViewService.getTrendingCases(req.query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trendingCases,
          "Trending cases fetched successfully"
        )
      );
  }
);

// Get user's viewed cases
export const getUserViewedCases = asyncHandler(
  async (req: Request, res: Response) => {
    const viewedCases = await CaseViewService.getUserViewedCases(req.user._id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          viewedCases,
          "User viewed cases fetched successfully"
        )
      );
  }
);

// Get most viewed cases
export const getMostViewedCases = asyncHandler(
  async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const mostViewed = await CaseViewService.getMostViewedCases(limit);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          mostViewed,
          "Most viewed cases fetched successfully"
        )
      );
  }
);

// Get overall statistics
export const getOverallStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CaseViewService.getOverallStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Overall statistics fetched successfully")
      );
  }
);

// Get view statistics by date range
export const getViewStatisticsByDateRange = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new ApiError(400, "Start date and end date are required");
    }

    const stats = await CaseViewService.getViewStatisticsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "View statistics fetched successfully")
      );
  }
);

// Get peak viewing hours
export const getPeakViewingHours = asyncHandler(
  async (req: Request, res: Response) => {
    const peakHours = await CaseViewService.getPeakViewingHours();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          peakHours,
          "Peak viewing hours fetched successfully"
        )
      );
  }
);
