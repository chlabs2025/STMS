import { Router } from "express";
import {
    paymentxlsl,
    localxlsl,
    specificxlsluser,
} from "../controllers/excel.controller.js";

const router = Router();

router.route("/export/payments").get(paymentxlsl);
router.route("/export/locals").get(localxlsl);
router.route("/export/user/:userId").get(specificxlsluser);

export default router;
