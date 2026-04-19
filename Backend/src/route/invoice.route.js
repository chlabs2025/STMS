import { Router } from "express";
import {
  createInvoice,
  getInvoicePdf,
  pdfHealthCheck,
  cleanAllData,
  getInvoiceHistory,
  getSlipPdf
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generateInvoice", verifyJWT, createInvoice);
router.get("/history", verifyJWT, getInvoiceHistory);
router.get("/invoice/:id/pdf", verifyJWT, getInvoicePdf);
router.get("/slip/:id/pdf", verifyJWT, getSlipPdf);
router.get("/pdf-health", pdfHealthCheck);
router.post("/cleanup-data", verifyJWT, cleanAllData);

export default router;