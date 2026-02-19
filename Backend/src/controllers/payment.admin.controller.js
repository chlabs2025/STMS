import { Payment } from "../models/payment.model.js";
import { generateQRCode } from "../service/qrGenerator.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Config } from "../models/config.model.js"
import { imliReturn } from "../models/imliReturn.model.js"
import { ImliAssign } from "../models/imliAssign.model.js"
import { localData } from "../models/local.model.js"

export const qrHandler = asyncHandler(async (req, res) => {
    const { upiId } = req.body;

    if (!upiId) throw new ApiError(400, "upiId is required");

    const existing = await Payment.findOne({ upiId });
    if (existing) {
        return res.status(200).json(
            new ApiResponse(200, { qr: existing.upiQrCode }, "QR already exists")
        );
    }

    const qr = await generateQRCode(upiId);

    await Payment.create({ upiId, upiQrCode: qr });
    return res.status(201).json(
        new ApiResponse(201, { qr }, "QR generated successfully")
    );
});


export const Imli_price_changer = asyncHandler(async (req, res) => {

    const { price } = req.body;
    const config = await Config.findOneAndUpdate(
        {},
        { $set: { price_per_cleaned_imli: price } },
        { returnDocument: 'after', upsert: true }
    );
    return res.status(200).json(
        new ApiResponse(200, { price: config.price_per_cleaned_imli }, "Price updated successfully")
    );

});

export const orderReference = asyncHandler(async (req, res) => {
    const { localID } = req.body;

    if (!localID) throw new ApiError(400, "localID required");

    const r = await imliReturn.findOne({ localID });
    if (!r) throw new ApiError(404, "Return record not found");

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    const total = r.returnedQuantity * p.price_per_cleaned_imli;

    return res.status(200).json(
        new ApiResponse(200, {
            orderReference: r._id,
            quantity: r.returnedQuantity,
            price_per_cleaned_imli: p.price_per_cleaned_imli,
            total,
        }, "Order details fetched successfully")
    );
});

export const confirmPayment = asyncHandler(async (req, res) => {
    const { localId, method } = req.body;

    if (!localId || !method) throw new ApiError(400, "localId and method are required");

    const r = await imliReturn.findOne({ localID: localId });
    if (!r) throw new ApiError(404, "Return record not found");

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    const local = await localData.findOne({ LocalID: localId });
    if (!local) throw new ApiError(404, "Local not found");

    const total = r.returnedQuantity * p.price_per_cleaned_imli;
    let localtotal = 0;
    localtotal += total;

    if (method === "Cash") {
        try {
            await Payment.create({
                local: local._id,
                method,
                amount: total
            });

            await localData.findOneAndUpdate(
                { LocalID: localId },
                { $inc: { totalPaidAmount: localtotal } }
            );

            await ImliAssign.findOneAndUpdate(
                { localID: localId },
                { $inc: { assignedQuantity: -r.returnedQuantity } }
            );

            await imliReturn.findOneAndUpdate(
                { localID: localId },
                { $inc: { returnedQuantity: -r.returnedQuantity } }
            );

            return res.status(201).json(
                new ApiResponse(201, {
                    orderReference: r._id,
                    total,
                    method,
                }, "Payment successful")
            );
        } catch (err) {
            throw new ApiError(500, err.message);
        }
    }

    if (method === "Online") {
        try {
            const paymentRecord = await Payment.findOne({ upiId: { $ne: "" } });
            if (!paymentRecord) throw new ApiError(404, "UPI not configured by admin");

            await Payment.create({
                local: local._id,
                method,
                amount: total
            });

            return res.status(200).json(
                new ApiResponse(200, {
                    orderReference: r._id,
                    total,
                    method,
                    upiId: paymentRecord.upiId,
                    qr: paymentRecord.upiQrCode,
                }, "Scan QR to pay")
            );
        } catch (err) {
            throw new ApiError(500, err.message);
        }
    }
});
