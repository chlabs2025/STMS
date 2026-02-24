import { Imli_price_changer, orderReference, confirmPayment , logsdetails} from "../controllers/payment.admin.controller.js"
import { Router } from "express"

const router = Router()


router.route("/imli-price").patch(Imli_price_changer)
router.route("/order-reference").post(orderReference)
router.route("/confirm-payment").post(confirmPayment)
router.route("/paymentlogs").get(logsdetails)

export default router;