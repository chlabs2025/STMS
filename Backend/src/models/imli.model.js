import mongoose, { Schema } from "mongoose";

const imliSchema = new Schema({
    rawImliQuantity:{
        type:Number,
        default: 0
    },
    totalCleanedImli:{
        type:Number,
        default: 0
    }
},{timestamps:true})

export const ImliData = mongoose.model("ImliData",imliSchema)
