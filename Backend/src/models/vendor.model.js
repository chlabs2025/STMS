import mongoose, { Schema } from "mongoose";

const vendorSchema = new Schema(
  {
    VendorID: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    totalRawImliSupplied: {
      type: Number,
      default: 0,
    },
    totalDebt: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const VendorData = mongoose.model("VendorData", vendorSchema);
