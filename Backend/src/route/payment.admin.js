import {qrHandler} from "../controllers/payment.admin.controller.js"
import { Router } from "express"

const router= Router()

router.route("/qrHandler").post(qrHandler)

export default router;