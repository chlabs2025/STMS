import { Router } from "express";
import { addLocal } from "../controllers/addLocal.controller.js";

const router = Router()

router.route("/addLocal").post(addLocal)

export default router;