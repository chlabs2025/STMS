import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    local: {
      type: Schema.Types.ObjectId,
      ref: "Local",
      required: true,
    },

    method: {
      type: String,
      enum: ["UPI", "CASH"],
      required: true,
    },

    price_per_cleand_imli:{
        type:String,
        require:true
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
      required: true,
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

