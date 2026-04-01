import { Imli_price_changer, orderReference, confirmPayment, get_Imli_Price , logsdetails, getAssignmentHistory} from "../controllers/payment.admin.controller.js"
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


router.route("/imli-price")
    .patch(verifyJWT, Imli_price_changer)
    .get(get_Imli_Price)

router.route("/order-reference").post(verifyJWT, orderReference)
router.route("/confirm-payment").post(verifyJWT, confirmPayment)
router.route("/paymentlogs").get(verifyJWT, logsdetails)
router.route("/assignment-history").get(verifyJWT, getAssignmentHistory)

export default router;