import { qrHandler, Imli_price_changer, orderReference, confirmPayment } from "../controllers/payment.admin.controller.js"
import { Router } from "express"

const router = Router()

router.route("/qrHandler").post(qrHandler)
router.route("/imli-price").patch(Imli_price_changer)
router.route("/order-reference").post(orderReference)
router.route("/confirm-payment").post(confirmPayment)

export default router;