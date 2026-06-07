import { Router } from "express";
import {
  addVendor,
  getVendors,
  getVendorById,
  getVendorHistory,
  addVendorPayment,
  deleteVendor,
} from "../controllers/vendor.controller.js";

const router = Router();

router.post("/vendors", addVendor);
router.get("/vendors", getVendors);
router.get("/vendors/:id", getVendorById);
router.get("/vendors/:id/history", getVendorHistory);
router.post("/vendors/:id/pay", addVendorPayment);
router.delete("/vendors/:id", deleteVendor);

export default router;
