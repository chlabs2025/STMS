import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema({
    orderReference: {
        type: String,
        required: true,
        index: true
    },

    LocalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LocalData",
        required: true
    },
    
    period: {
        type: Date,
        required: true,
        index: true
    },

    assignedQty: {
        type: Number,
        required: true,
        min: 0
    },

    cleanedQty: {
        type: Number,
        required: true,
        min: 0
    },

    rate: {
        type: Number,
        required: true,
        min: 0
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "Online"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
       default: "PENDING",
    },

    notes: String

}, { timestamps: true });

export const logs = mongoose.model("PaymentLog",  paymentLogSchema);
