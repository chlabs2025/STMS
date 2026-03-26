import { Router } from "express";
import { addRawImli, getRawImli } from "../controllers/addRawImli.controller.js";

const router = Router()

router.route("/addRawImli").post(addRawImli)
router.route("/getRawImli").get(getRawImli)

export default router;