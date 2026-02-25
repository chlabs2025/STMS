import mongoose from "mongoose";

const slipItemSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false },
);

const slipSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },

    receiverName: String,
    senderAddress: String,
    slipNumber:Number,
    driverName:String,

    date: {
      type: Date,
      default: Date.now,
    },

    items: [slipItemSchema],

    totalWeight: Number,
    totalAmount: Number,
  },
  { timestamps: true },
);

const Slip = mongoose.model("Slip", slipSchema);

export default Slip;
