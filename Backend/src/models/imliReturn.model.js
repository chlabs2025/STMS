import mongoose from "mongoose";

const imliReturnSchema = new mongoose.Schema(
  {
    localID: {
      type:String,
      required: true
    },
    localName: {
      type: String,
      required: true
    },
    returnedQuantity: {
      type: Number,
      required: true
    },
    assignmentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ImliAssign"
    }],
    isPaid: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const imliReturn = mongoose.model(
  "imliReturn",
  imliReturnSchema
);
