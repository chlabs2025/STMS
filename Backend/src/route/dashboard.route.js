import { Router } from "express";
import { getRecentActivities, getAuditLogs, get7DayTrend } from "../controllers/activity.controller.js";

const router = Router();

router.get("/dashboard/activity", getRecentActivities);
router.get("/dashboard/full-activity", getAuditLogs);
router.get("/dashboard/trend", get7DayTrend);

export default router;
