
import {Payment} from "../models/payment.model.js"
import { getOrGenerateQR } from "../service/qrGenerator.js";
import { localData } from "../models/local.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const qrHandler = asyncHandler(async (req, res) => {
    const { localID } = req.body;

    if (!localID) {
        throw new ApiError(400, "localID is required");
    }

    const local = await localData.findOne({ localID });

    if (!local) {
        throw new ApiError(404, "Local not found");
    }

    let qr;
    try {
        qr = await getOrGenerateQR(local);
    } catch (err) {
        throw new ApiError(400, err.message);
    }

    return res.status(200).json(
        new ApiResponse(200, { qr }, "QR generated successfully")
    );
});

export const payment=asyncHandler(async(req , res)=>{

});