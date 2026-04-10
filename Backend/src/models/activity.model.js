import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["RESTOCK", "CLEANED_RESTOCK", "ASSIGNMENT", "RETURN", "REGISTRATION", "PAYMENT"],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            default: "KG"
        },
        localName: {
            type: String,
            default: ""
        },
        actor: {
            type: String,
            default: "Admin"
        }
    },
    { timestamps: true }
);

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
