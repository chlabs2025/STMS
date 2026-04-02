import { Router } from "express";
import { addCleanedImli } from "../controllers/addCleanedImli.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/addCleanedImli").post(verifyJWT, addCleanedImli);

export default router;
