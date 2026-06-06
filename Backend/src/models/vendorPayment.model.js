import mongoose, { Schema } from "mongoose";

const vendorPaymentSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "VendorData",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["Cash", "Online"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const VendorPayment = mongoose.model("VendorPayment", vendorPaymentSchema);
