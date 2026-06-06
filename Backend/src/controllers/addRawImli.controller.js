import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { ImliData } from "../models/imli.model.js";
import { VendorData } from "../models/vendor.model.js";
import { VendorPurchase } from "../models/vendorPurchase.model.js";
import { logActivity } from "./activity.controller.js";

export const getRawImli = asyncHandler(async (req, res) => {
  const imli = await ImliData.findOne({});
  const rawImliQuantity = imli ? imli.rawImliQuantity : 0;
  const totalCleanedImli = imli ? imli.totalCleanedImli : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { rawImliQuantity, totalCleanedImli }, "Imli data fetched successfully")
    );
});

export const addRawImli = asyncHandler(async (req, res) => {
  const { rawImliQuantity, vendorId, pricePerKg } = req.body;

  if (!rawImliQuantity) throw new ApiError(400, "imli quantity is required");
  if (rawImliQuantity < 0) throw new ApiError(400, "imli quantity cannt be negative");


  const imli = await ImliData.findOneAndUpdate(
    {},
    { $inc: { rawImliQuantity } }, // add quantity
    {
      returnDocument: 'after', // return updated doc
      upsert: true, // create if not exists (first time)
    }
  );

  let additionalLogData = "";

  // If vendor details are provided, record the purchase
  if (vendorId && pricePerKg) {
    const vendor = await VendorData.findById(vendorId);
    if (vendor) {
      const totalCost = Number(rawImliQuantity) * Number(pricePerKg);
      
      await VendorPurchase.create({
        vendor: vendor._id,
        quantity: Number(rawImliQuantity),
        pricePerKg: Number(pricePerKg),
        totalCost
      });

      vendor.totalRawImliSupplied += Number(rawImliQuantity);
      vendor.totalDebt += totalCost;
      await vendor.save();

      additionalLogData = ` from Vendor: ${vendor.name} at ₹${pricePerKg}/kg (Total: ₹${totalCost})`;
    }
  }

  // Log activity
  await logActivity({
    type: "RESTOCK",
    description: `Added ${rawImliQuantity} KG of raw Imli to stock${additionalLogData}`,
    quantity: rawImliQuantity,
    actor: "Admin"
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        imli,
        "raw Imli added successfully"
      )
    )
});
