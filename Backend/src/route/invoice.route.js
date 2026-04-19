import { Router } from "express";
import {
  createInvoice,
  getInvoicePdf,
  pdfHealthCheck,
  cleanAllData
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/generateInvoice", verifyJWT, createInvoice);
router.get("/invoice/:id/pdf", verifyJWT, getInvoicePdf);
router.get("/pdf-health", pdfHealthCheck);
router.post("/cleanup-data", verifyJWT, cleanAllData);

export default router;