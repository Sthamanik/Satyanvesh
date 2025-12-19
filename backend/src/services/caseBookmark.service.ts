import caseBookmarkModel from "@models/caseBookmark.model.js";
import caseModel from "@models/case.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface AddBookmarkData {
  userId: string;
  caseId: string;
  notes?: string;
}

interface UpdateBookmarkData {
  notes?: string;
}

class CaseBookmarkService {
  // Add bookmark
  async addBookmark(data: AddBookmarkData) {
    const { userId, caseId, notes } = data;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Check if already bookmarked
    const existingBookmark = await caseBookmarkModel.findOne({
      userId,
      caseId,
    });
    if (existingBookmark) {
      throw new ApiError(409, "Case already bookmarked");
    }

    // Create bookmark
    const bookmark = await caseBookmarkModel.create({
      userId,
      caseId,
      notes,
    });

    // Increment bookmark count in case
    await caseModel.findByIdAndUpdate(caseId, { $inc: { bookmarkCount: 1 } });

    // Populate case details
    const populatedBookmark = await caseBookmarkModel
      .findById(bookmark._id)
      .populate({
        path: "caseId",
        select: "caseNumber title status courtId caseTypeId nextHearingDate",
        populate: [
          { path: "courtId", select: "name code" },
          { path: "caseTypeId", select: "name category" },
        ],
      });

    return populatedBookmark;
  }

  // Get user bookmarks
  async getUserBookmarks(userId: string) {
    const bookmarks = await caseBookmarkModel
      .find({ userId })
      .populate({
        path: "caseId",
        select: "caseNumber title status courtId caseTypeId nextHearingDate",
        populate: [
          { path: "courtId", select: "name code type" },
          { path: "caseTypeId", select: "name category" },
        ],
      })
      .sort({ createdAt: -1 });

    return bookmarks;
  }

  // Get bookmark by ID
  async getBookmarkById(bookmarkId: string) {
    const bookmark = await caseBookmarkModel.findById(bookmarkId).populate({
      path: "caseId",
      select: "caseNumber title status courtId caseTypeId nextHearingDate",
      populate: [
        { path: "courtId", select: "name code type" },
        { path: "caseTypeId", select: "name category" },
      ],
    });

    if (!bookmark) {
      throw new ApiError(404, "Bookmark not found");
    }

    return bookmark;
  }

  // Check if case is bookmarked by user
  async checkBookmark(userId: string, caseId: string) {
    const bookmark = await caseBookmarkModel.findOne({ userId, caseId });

    return {
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?._id || null,
    };
  }

  // Update bookmark notes
  async updateBookmark(
    bookmarkId: string,
    userId: string,
    data: UpdateBookmarkData
  ) {
    const bookmark = await caseBookmarkModel
      .findOneAndUpdate(
        { _id: bookmarkId, userId }, // Ensure user owns the bookmark
        { $set: data },
        { new: true, runValidators: true }
      )
      .populate({
        path: "caseId",
        select: "caseNumber title status courtId caseTypeId nextHearingDate",
        populate: [
          { path: "courtId", select: "name code" },
          { path: "caseTypeId", select: "name category" },
        ],
      });

    if (!bookmark) {
      throw new ApiError(404, "Bookmark not found or unauthorized");
    }

    return bookmark;
  }

  // Remove bookmark
  async removeBookmark(bookmarkId: string, userId: string) {
    const bookmark = await caseBookmarkModel.findOneAndDelete({
      _id: bookmarkId,
      userId, // Ensure user owns the bookmark
    });

    if (!bookmark) {
      throw new ApiError(404, "Bookmark not found or unauthorized");
    }

    // Decrement bookmark count in case
    await caseModel.findByIdAndUpdate(bookmark.caseId, {
      $inc: { bookmarkCount: -1 },
    });

    return null;
  }

  // Remove bookmark by case ID
  async removeBookmarkByCase(userId: string, caseId: string) {
    const bookmark = await caseBookmarkModel.findOneAndDelete({
      userId,
      caseId,
    });

    if (!bookmark) {
      throw new ApiError(404, "Bookmark not found");
    }

    // Decrement bookmark count in case
    await caseModel.findByIdAndUpdate(caseId, { $inc: { bookmarkCount: -1 } });

    return null;
  }

  // Get bookmarks with upcoming hearings
  async getBookmarksWithUpcomingHearings(userId: string) {
    const bookmarks = await caseBookmarkModel
      .find({ userId })
      .populate({
        path: "caseId",
        match: { nextHearingDate: { $gte: new Date() } },
        select: "caseNumber title status nextHearingDate courtId caseTypeId",
        populate: [
          { path: "courtId", select: "name code" },
          { path: "caseTypeId", select: "name category" },
        ],
      })
      .sort({ "caseId.nextHearingDate": 1 });

    // Filter out bookmarks where case was not matched
    return bookmarks.filter((bookmark) => bookmark.caseId !== null);
  }

  // Get bookmark statistics for user
  async getUserBookmarkStatistics(userId: string) {
    const totalBookmarks = await caseBookmarkModel.countDocuments({ userId });

    const bookmarksByStatus = await caseBookmarkModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "cases",
          localField: "caseId",
          foreignField: "_id",
          as: "case",
        },
      },
      { $unwind: "$case" },
      {
        $group: {
          _id: "$case.status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const upcomingHearings = await caseBookmarkModel.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "cases",
          localField: "caseId",
          foreignField: "_id",
          as: "case",
        },
      },
      { $unwind: "$case" },
      {
        $match: {
          "case.nextHearingDate": { $gte: new Date() },
        },
      },
      {
        $count: "total",
      },
    ]);

    return {
      totalBookmarks,
      bookmarksByStatus,
      upcomingHearingsCount: upcomingHearings[0]?.total || 0,
    };
  }

  // Get overall bookmark statistics (admin)
  async getBookmarkStatistics() {
    const totalBookmarks = await caseBookmarkModel.countDocuments();

    const uniqueUsers = await caseBookmarkModel.distinct("userId");
    const uniqueCases = await caseBookmarkModel.distinct("caseId");

    const topBookmarkedCases = await caseBookmarkModel.aggregate([
      {
        $group: {
          _id: "$caseId",
          bookmarkCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookmarkCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "cases",
          localField: "_id",
          foreignField: "_id",
          as: "case",
        },
      },
      { $unwind: "$case" },
      {
        $project: {
          caseId: "$_id",
          caseNumber: "$case.caseNumber",
          title: "$case.title",
          bookmarkCount: 1,
        },
      },
    ]);

    return {
      totalBookmarks,
      uniqueUsersBookmarking: uniqueUsers.length,
      uniqueCasesBookmarked: uniqueCases.length,
      topBookmarkedCases,
    };
  }
}

export default new CaseBookmarkService();
