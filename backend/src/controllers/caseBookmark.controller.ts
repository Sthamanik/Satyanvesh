import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import CaseBookmarkService from "@services/caseBookmark.service.js";

// Add bookmark
export const addBookmark = asyncHandler(async (req: Request, res: Response) => {
  const bookmark = await CaseBookmarkService.addBookmark({
    userId: req.user._id,
    ...req.body,
  });

  res
    .status(201)
    .json(new ApiResponse(201, bookmark, "Bookmark added successfully"));
});

// Get user bookmarks
export const getUserBookmarks = asyncHandler(
  async (req: Request, res: Response) => {
    const bookmarks = await CaseBookmarkService.getUserBookmarks(req.user._id);

    res
      .status(200)
      .json(new ApiResponse(200, bookmarks, "Bookmarks fetched successfully"));
  }
);

// Get bookmark by ID
export const getBookmarkById = asyncHandler(
  async (req: Request, res: Response) => {
    const bookmark = await CaseBookmarkService.getBookmarkById(req.params.id);

    res
      .status(200)
      .json(new ApiResponse(200, bookmark, "Bookmark fetched successfully"));
  }
);

// Check if case is bookmarked
export const checkBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await CaseBookmarkService.checkBookmark(
      req.user._id,
      req.params.caseId
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Bookmark status checked"));
  }
);

// Update bookmark
export const updateBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const bookmark = await CaseBookmarkService.updateBookmark(
      req.params.id,
      req.user._id,
      req.body
    );

    res
      .status(200)
      .json(new ApiResponse(200, bookmark, "Bookmark updated successfully"));
  }
);

// Remove bookmark
export const removeBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    await CaseBookmarkService.removeBookmark(req.params.id, req.user._id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Bookmark removed successfully"));
  }
);

// Remove bookmark by case
export const removeBookmarkByCase = asyncHandler(
  async (req: Request, res: Response) => {
    await CaseBookmarkService.removeBookmarkByCase(
      req.user._id,
      req.params.caseId
    );

    res
      .status(200)
      .json(new ApiResponse(200, null, "Bookmark removed successfully"));
  }
);

// Get bookmarks with upcoming hearings
export const getBookmarksWithUpcomingHearings = asyncHandler(
  async (req: Request, res: Response) => {
    const bookmarks =
      await CaseBookmarkService.getBookmarksWithUpcomingHearings(req.user._id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          bookmarks,
          "Bookmarks with upcoming hearings fetched successfully"
        )
      );
  }
);

// Get user bookmark statistics
export const getUserBookmarkStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CaseBookmarkService.getUserBookmarkStatistics(
      req.user._id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          stats,
          "User bookmark statistics fetched successfully"
        )
      );
  }
);

// Get overall bookmark statistics (admin)
export const getBookmarkStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await CaseBookmarkService.getBookmarkStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "Bookmark statistics fetched successfully")
      );
  }
);
