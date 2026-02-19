import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    local: {
      type: Schema.Types.ObjectId,
      ref: "localData",
    },

    localID: {
      type: Number,
    },

    method: {
      type: String,
      enum: ["UPI", "CASH"],
    },

    upiId: {
      type: String,
      default: "",
    },

    upiQrCode: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);