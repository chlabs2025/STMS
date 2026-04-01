import { Router } from "express";
import { saveSettings, getSettings } from "../controllers/settings.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/saveSetting", verifyJWT, saveSettings);
router.get("/settings", getSettings);

export default router;
