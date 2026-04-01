import { Router } from "express";
import { addRawImli, getRawImli } from "../controllers/addRawImli.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addRawImli").post(verifyJWT, addRawImli)
router.route("/getRawImli").get(getRawImli)

export default router;