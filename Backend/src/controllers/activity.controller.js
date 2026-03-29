import { ActivityLog } from "../models/activity.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
