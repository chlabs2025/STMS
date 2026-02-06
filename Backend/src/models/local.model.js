
import mongoose, { Schema } from "mongoose";

const localSchema = new Schema(
  {
    LocalID: {
      type: Number,
      required: true,
      unique: true,
    },

    LocalName: {
      type: String,
      required: true,
    },

    LocalAddress: {
      type: String,
      required: true,
    },

    LocalPhone: {
      type: Number,
      required: true,
    },

    totalAssignedQuantity: {
      type: Number,
      default: 0,
    },

    totalReturnedQuantity: {
      type: Number,
      default: 0,
    },

    totalPaidAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const localData = mongoose.model("localData", localSchema);
