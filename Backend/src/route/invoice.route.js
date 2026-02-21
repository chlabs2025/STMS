import { Router } from "express";
import {
  createInvoice,
  getInvoicePdf
} from "../controllers/invoice.controller.js";

const router = Router();

router.post("/generateInvoice", createInvoice);

export default router;