import { Router } from "express";
import {
  createInvoice,
  getInvoicePdf
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generateInvoice", verifyJWT, createInvoice);
router.get("/invoice/:id/pdf", verifyJWT, getInvoicePdf);

export default router;