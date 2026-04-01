import { Router } from "express";
import { addLocal } from "../controllers/addLocal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addLocal").post(verifyJWT, addLocal)

export default router;