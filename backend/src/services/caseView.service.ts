import caseViewModel from "@models/caseView.model.js";
import caseModel from "@models/case.model.js";
import { ApiError } from "@utils/apiError.util.js";
import mongoose from "mongoose";

interface TrackCaseViewData {
  userId?: string;
  caseId: string;
  ipAddress?: string;
  userAgent?: string;
}

interface GetCaseViewAnalyticsQuery {
  startDate?: string;
  endDate?: string;
}

interface GetTrendingCasesQuery {
  days?: string;
  limit?: string;
}

class CaseViewService {
  // Track case view
  async trackCaseView(data: TrackCaseViewData) {
    const { userId, caseId, ipAddress, userAgent } = data;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Create view record
    await caseViewModel.create({
      userId: userId || null,
      caseId,
      ipAddress,
      userAgent,
      viewedAt: new Date(),
    });

    return null;
  }

  // Get case view analytics
  async getCaseViewAnalytics(caseId: string, query: GetCaseViewAnalyticsQuery) {
    const { startDate, endDate } = query;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const filter: any = { caseId };

    if (startDate || endDate) {
      filter.viewedAt = {};
      if (startDate) filter.viewedAt.$gte = new Date(startDate);
      if (endDate) filter.viewedAt.$lte = new Date(endDate);
    }

    const views = await caseViewModel.find(filter).sort({ viewedAt: -1 });

    const totalViews = views.length;
    const uniqueUsers = new Set(
      views.map((v) => v.userId?.toString()).filter(Boolean)
    ).size;
    const anonymousViews = views.filter((v) => !v.userId).length;

    // Views by date
    const viewsByDate = await caseViewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Views by hour (for recent activity)
    const viewsByHour = await caseViewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $hour: "$viewedAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      totalViews,
      uniqueUsers,
      anonymousViews,
      registeredUserViews: totalViews - anonymousViews,
      viewsByDate,
      viewsByHour,
      recentViews: views.slice(0, 20),
    };
  }

  // Get trending cases
  async getTrendingCases(query: GetTrendingCasesQuery) {
    const { days = "7", limit = "10" } = query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const trendingCases = await caseViewModel.aggregate([
      { $match: { viewedAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$caseId",
          viewCount: { $sum: 1 },
          uniqueViewers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          caseId: "$_id",
          viewCount: 1,
          uniqueViewerCount: { $size: "$uniqueViewers" },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: Number(limit) },
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
        $lookup: {
          from: "courts",
          localField: "case.courtId",
          foreignField: "_id",
          as: "court",
        },
      },
      { $unwind: "$court" },
      {
        $lookup: {
          from: "casetypes",
          localField: "case.caseTypeId",
          foreignField: "_id",
          as: "caseType",
        },
      },
      { $unwind: "$caseType" },
      {
        $project: {
          caseId: 1,
          viewCount: 1,
          uniqueViewerCount: 1,
          caseNumber: "$case.caseNumber",
          title: "$case.title",
          status: "$case.status",
          court: { name: "$court.name", code: "$court.code" },
          caseType: { name: "$caseType.name", category: "$caseType.category" },
        },
      },
    ]);

    return trendingCases;
  }

  // Get user's viewed cases
  async getUserViewedCases(userId: string, limit: number = 20) {
    const viewedCases = await caseViewModel
      .find({ userId })
      .populate({
        path: "caseId",
        select: "caseNumber title status courtId caseTypeId",
        populate: [
          { path: "courtId", select: "name code" },
          { path: "caseTypeId", select: "name category" },
        ],
      })
      .sort({ viewedAt: -1 })
      .limit(limit);

    return viewedCases;
  }

  // Get view statistics by date range
  async getViewStatisticsByDateRange(startDate: Date, endDate: Date) {
    const totalViews = await caseViewModel.countDocuments({
      viewedAt: { $gte: startDate, $lte: endDate },
    });

    const uniqueUsers = await caseViewModel.distinct("userId", {
      viewedAt: { $gte: startDate, $lte: endDate },
      userId: { $ne: null },
    });

    const anonymousViews = await caseViewModel.countDocuments({
      viewedAt: { $gte: startDate, $lte: endDate },
      userId: null,
    });

    const viewsByDate = await caseViewModel.aggregate([
      { $match: { viewedAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" },
          },
          totalViews: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          date: "$_id",
          totalViews: 1,
          uniqueUserCount: { $size: "$uniqueUsers" },
        },
      },
      { $sort: { date: 1 } },
    ]);

    return {
      totalViews,
      uniqueUsersCount: uniqueUsers.length,
      anonymousViews,
      registeredUserViews: totalViews - anonymousViews,
      viewsByDate,
    };
  }

  // Get most viewed cases (all time)
  async getMostViewedCases(limit: number = 10) {
    const mostViewed = await caseViewModel.aggregate([
      {
        $group: {
          _id: "$caseId",
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: limit },
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
          viewCount: 1,
          caseNumber: "$case.caseNumber",
          title: "$case.title",
          status: "$case.status",
        },
      },
    ]);

    return mostViewed;
  }

  // Get overall view statistics
  async getOverallStatistics() {
    const totalViews = await caseViewModel.countDocuments();
    const uniqueUsers = await caseViewModel.distinct("userId", {
      userId: { $ne: null },
    });
    const anonymousViews = await caseViewModel.countDocuments({ userId: null });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayViews = await caseViewModel.countDocuments({
      viewedAt: { $gte: today },
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysViews = await caseViewModel.countDocuments({
      viewedAt: { $gte: last7Days },
    });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const last30DaysViews = await caseViewModel.countDocuments({
      viewedAt: { $gte: last30Days },
    });

    return {
      totalViews,
      uniqueUsersCount: uniqueUsers.length,
      anonymousViews,
      registeredUserViews: totalViews - anonymousViews,
      todayViews,
      last7DaysViews,
      last30DaysViews,
    };
  }

  // Get peak viewing hours
  async getPeakViewingHours() {
    const viewsByHour = await caseViewModel.aggregate([
      {
        $group: {
          _id: { $hour: "$viewedAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return viewsByHour;
  }
}

export default new CaseViewService();
