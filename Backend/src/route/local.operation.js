import { return_local, delete_local, update_local } from "../controllers/admin.operator.local.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/return_local", verifyJWT, return_local);
router.post("/return_local", verifyJWT, return_local);
router.post("/delete_local", verifyJWT, delete_local);
router.post("/update_local", verifyJWT, update_local);

export default router;
