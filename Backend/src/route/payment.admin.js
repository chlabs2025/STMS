import { Imli_price_changer, orderReference, confirmPayment, get_Imli_Price , logsdetails, getAssignmentHistory} from "../controllers/payment.admin.controller.js"
import { Router } from "express"

const router = Router()


router.route("/imli-price")
    .patch(Imli_price_changer)
    .get(get_Imli_Price)

router.route("/order-reference").post(orderReference)
router.route("/confirm-payment").post(confirmPayment)
router.route("/paymentlogs").get(logsdetails)
router.route("/assignment-history").get(getAssignmentHistory)

export default router;