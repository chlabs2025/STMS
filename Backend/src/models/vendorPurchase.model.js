import mongoose, { Schema } from "mongoose";

const vendorPurchaseSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "VendorData",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const VendorPurchase = mongoose.model("VendorPurchase", vendorPurchaseSchema);
