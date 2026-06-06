import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { VendorData } from "../models/vendor.model.js";
import { VendorPurchase } from "../models/vendorPurchase.model.js";
import { VendorPayment } from "../models/vendorPayment.model.js";
import { logActivity } from "./activity.controller.js";

// Generate unique Vendor ID
const generateVendorId = async () => {
  const lastVendor = await VendorData.findOne().sort({ VendorID: -1 });
  return lastVendor && lastVendor.VendorID ? lastVendor.VendorID + 1 : 1001;
};

export const addVendor = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  if (!name) throw new ApiError(400, "Vendor name is required");

  const VendorID = await generateVendorId();

  const vendor = await VendorData.create({
    VendorID,
    name,
    phone: phone || "",
    address: address || "",
  });

  await logActivity({
    type: "ADD_VENDOR",
    description: `Added new vendor: ${name}`,
    actor: "Admin",
  });

  return res.status(201).json(new ApiResponse(201, vendor, "Vendor added successfully"));
});

export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await VendorData.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, vendors, "Vendors retrieved successfully"));
});

export const getVendorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vendor = await VendorData.findById(id);

  if (!vendor) throw new ApiError(404, "Vendor not found");

  return res.status(200).json(new ApiResponse(200, vendor, "Vendor retrieved successfully"));
});

export const getVendorHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const vendor = await VendorData.findById(id);

  if (!vendor) throw new ApiError(404, "Vendor not found");

  const purchases = await VendorPurchase.find({ vendor: id }).sort({ createdAt: -1 });
  const payments = await VendorPayment.find({ vendor: id }).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { vendor, purchases, payments }, "Vendor history retrieved successfully")
  );
});

export const addVendorPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, method, notes } = req.body;

  if (!amount || amount <= 0) throw new ApiError(400, "Invalid payment amount");

  const vendor = await VendorData.findById(id);
  if (!vendor) throw new ApiError(404, "Vendor not found");

  const payment = await VendorPayment.create({
    vendor: id,
    amount,
    method: method || "Cash",
    status: "SUCCESS",
    notes: notes || "",
  });

  vendor.totalPaid += amount;
  await vendor.save();

  await logActivity({
    type: "VENDOR_PAYMENT",
    description: `Paid ₹${amount} to vendor ${vendor.name} via ${payment.method}`,
    actor: "Admin",
  });

  return res.status(200).json(new ApiResponse(200, { payment, vendor }, "Vendor payment recorded successfully"));
});
