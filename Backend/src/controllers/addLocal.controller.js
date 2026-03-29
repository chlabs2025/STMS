import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateQRCode } from "../service/qrGenerator.service.js";

import { localData } from "../models/local.model.js";
import { logActivity } from "./activity.controller.js";

export const addLocal = asyncHandler(async (req, res) => {
  const { LocalID, LocalName, LocalAddress, LocalPhone, upiId } = req.body;

  //if (!LocalID || !LocalName || !LocalAddress || !LocalPhone) {
  //throw new ApiError(400, "All required fields must be provided");
  //}

  const existingLocal = await localData.findOne({ LocalID });
  if (existingLocal) {
    throw new ApiError(409, "Local already exists");
  }

  // If UPI ID is provided, auto-generate QR code
  let upiQrCode = "";
  if (upiId) {
    upiQrCode = await generateQRCode(upiId, LocalName);
  }

  const local = await localData.create({
    LocalID,
    LocalName,
    LocalAddress,
    LocalPhone,
    upiId: upiId || "",
    upiQrCode,
  });

  // Log activity
  await logActivity({
      type: "REGISTRATION",
      description: `Registered new local: ${LocalName}`,
      localName: LocalName
  });

  return res.status(201).json(
    new ApiResponse(201, local, "Local added successfully")
  );
});
