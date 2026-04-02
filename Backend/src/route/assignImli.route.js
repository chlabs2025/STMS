import { Router } from "express";
import { assignImli } from "../controllers/assignImli.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/assignImli").post(verifyJWT, assignImli)

export default router;