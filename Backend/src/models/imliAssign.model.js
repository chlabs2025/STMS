import mongoose from "mongoose";

const imliAssignSchema = new mongoose.Schema(
  {
    localID: {
      type:String,
      required: true
    },
    localName: {
      type: String,
      required: true
    },
    assignedQuantity: {
      type: Number,
      required: true
    },
    assignedBy: {
      type: String, 
      required: true
    },
    returnedQuantity: {
      type: Number,
      default: 0
    },
    cleanedQuantity: {
      type: Number,
      default: 0
    },
    returnBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "imliReturn",
      default: null
    }
  },
  { timestamps: true }
);

export const ImliAssign = mongoose.model(
  "ImliAssign",
  imliAssignSchema
);
