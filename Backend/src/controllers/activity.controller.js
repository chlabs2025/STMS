import { ActivityLog } from "../models/activity.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Controller to fetch 7-day inventory trend data
 * Aggregates RESTOCK (raw added) and RETURN (cleaned returned) from ActivityLog
 */
export const get7DayTrend = asyncHandler(async (req, res) => {
  const now = new Date();

  // Start of 6 days ago (so we get today + 6 previous = 7 days total)
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Aggregate: group by date string + type, sum quantities
  const results = await ActivityLog.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        type: { $in: ["RESTOCK", "RETURN"] },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          type: "$type",
        },
        total: { $sum: "$quantity" },
      },
    },
  ]);

  // Build the 7-day label array (oldest → newest)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const label = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue …
    days.push({ dateStr, label });
  }

  // Build a lookup map from aggregation results
  const lookup = {};
  results.forEach(({ _id, total }) => {
    if (!lookup[_id.date]) lookup[_id.date] = { raw: 0, cleaned: 0 };
    if (_id.type === "RESTOCK") lookup[_id.date].raw = total;
    if (_id.type === "RETURN") lookup[_id.date].cleaned = total;
  });

  // Format final trend array
  const trendData = days.map(({ dateStr, label }) => ({
    day: label,
    raw: lookup[dateStr]?.raw || 0,
    cleaned: lookup[dateStr]?.cleaned || 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, trendData, "7-day trend fetched successfully"));
});

/**
 * Utility function to log system activities
 */
export const logActivity = async ({ type, description, quantity = 0, unit = "KG", localName = "", actor = "Admin" }) => {
    try {
        await ActivityLog.create({
            type,
            description,
            quantity,
            unit,
            localName,
            actor
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

/**
 * Controller to fetch recent activities for the dashboard
 */
export const getRecentActivities = asyncHandler(async (req, res) => {
    const activities = await ActivityLog.find({})
        .sort({ createdAt: -1 })
        .limit(10); // Fetch top 10 recent activities

    return res
        .status(200)
        .json(
            new ApiResponse(200, activities, "Recent activities fetched successfully")
        );
});

/**
 * Controller to fetch ALL activities for the full Audit Log page
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
    const { type, localName, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (localName) {
        query.localName = { $regex: localName, $options: "i" };
    }

    const activities = await ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));

    const total = await ActivityLog.countDocuments(query);

    return res
        .status(200)
        .json(
            new ApiResponse(200, { activities, total }, "Audit logs fetched successfully")
        );
});
