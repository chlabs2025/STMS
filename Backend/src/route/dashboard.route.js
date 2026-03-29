import { Router } from "express";
import { getRecentActivities, getAuditLogs } from "../controllers/activity.controller.js";

const router = Router();

router.get("/dashboard/activity", getRecentActivities);
router.get("/dashboard/full-activity", getAuditLogs);

export default router;
