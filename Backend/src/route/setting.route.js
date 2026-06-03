import { Router } from "express";
import { saveSettings, getSettings, clearInventory } from "../controllers/settings.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/saveSetting", verifyJWT, saveSettings);
router.get("/settings", getSettings);
router.post("/clear-inventory", verifyJWT, clearInventory);

export default router;
