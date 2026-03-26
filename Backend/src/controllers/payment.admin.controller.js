import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Config } from "../models/config.model.js"
import { localData } from "../models/local.model.js"
import { logs } from "../models/logs.model.js"
import { ImliData } from "../models/imli.model.js"
import { ImliAssign } from "../models/imliAssign.model.js"

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

export const get_Imli_Price = asyncHandler(async (req, res) => {
    const config = await Config.findOne();
    return res.status(200).json(
        new ApiResponse(200, { price: config?.price_per_cleaned_imli || 15 }, "Price fetched successfully")
    );
});


export const orderReference = asyncHandler(async (req, res) => {
    const { localID } = req.body;

    if (!localID) throw new ApiError(400, "localID required");

    const local = await localData.findOne({ LocalID: localID });
    if (!local) throw new ApiError(404, "Local not found");

    if (!local.totalReturnedQuantity || local.totalReturnedQuantity <= 0) {
        throw new ApiError(404, "No pending return for this local");
    }

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    const total = local.totalReturnedQuantity * p.price_per_cleaned_imli;

    return res.status(200).json(
        new ApiResponse(200, {
            orderReference: local._id,
            quantity: local.totalReturnedQuantity,
            price_per_cleaned_imli: p.price_per_cleaned_imli,
            total,
        }, "Order details fetched successfully")
    );
});

export const confirmPayment = asyncHandler(async (req, res) => {
    const { localId, method, status } = req.body;

    if (!localId || !method) throw new ApiError(400, "localId and method are required");

    const local = await localData.findOne({ LocalID: localId });
    if (!local) throw new ApiError(404, "Local not found");

    if (!local.totalReturnedQuantity || local.totalReturnedQuantity <= 0) {
        throw new ApiError(404, "No pending return for payment");
    }

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    const total = local.totalReturnedQuantity * p.price_per_cleaned_imli;
    const localTotalPaid = local.totalPaidAmount + total;

    // ─── CASH: direct SUCCESS ───
    if (method === "Cash") {
        await Payment.create({
            local: local._id,
            localID: localId,
            method,
            amount: total,
            status: "SUCCESS"
        });

        await logs.create({
            orderReference: local._id.toString(),
            LocalID: localId,
            period: new Date(),
            assignedQty: local.totalAssignedQuantity,
            cleanedQty: local.totalReturnedQuantity,
            rate: p.price_per_cleaned_imli,
            totalAmount: total,
            paymentMethod: "Cash",
            paymentStatus: "SUCCESS"
        });

        // Accumulate cleaned imli into global tracker before resetting
        await ImliData.findOneAndUpdate(
            {},
            { $inc: { totalCleanedImli: local.totalReturnedQuantity } },
            { upsert: true }
        );

        await localData.findOneAndUpdate(
            { LocalID: localId },
            {
                $inc: { totalPaidAmount: total },
                $set: { totalAssignedQuantity: 0, totalReturnedQuantity: 0 }
            }
        );



        return res.status(201).json(
            new ApiResponse(201, {
                orderReference: local._id,
                total,
                localTotalPaid,
                method,
                status: "SUCCESS"
            }, "Payment successful")
        );
    }

    // ─── ONLINE: 2-step flow ───
    if (method === "Online") {
        if (!local.upiId || !local.upiQrCode) {
            throw new ApiError(404, "UPI not configured for this local");
        }

        // Step 1: No status → PENDING + QR
        if (!status) {
            const payment = await Payment.create({
                local: local._id,
                localID: localId,
                method,
                amount: total,
                status: "PENDING"
            });

            return res.status(200).json(
                new ApiResponse(200, {
                    paymentId: payment._id,
                    orderReference: local._id,
                    total,
                    method,
                    status: "PENDING",
                    upiId: local.upiId,
                    qr: local.upiQrCode,
                }, "Scan QR to pay")
            );
        }

        // Step 2: SUCCESS or REJECTED
        const pendingPayment = await Payment.findOne({
            localID: localId,
            method: "Online",
            status: "PENDING"
        });
        if (!pendingPayment) throw new ApiError(404, "No pending payment found");

        if (status === "SUCCESS") {
            await Payment.findOneAndUpdate(
                { _id: pendingPayment._id },
                { $set: { status: "SUCCESS" } }
            );

            await logs.create({
                orderReference: local._id.toString(),
                LocalID: localId,
                period: new Date(),
                assignedQty: local.totalAssignedQuantity,
                cleanedQty: local.totalReturnedQuantity,
                rate: p.price_per_cleaned_imli,
                totalAmount: total,
                paymentMethod: "Online",
                paymentStatus: "SUCCESS"
            });


            // Accumulate cleaned imli into global tracker before resetting
            await ImliData.findOneAndUpdate(
                {},
                { $inc: { totalCleanedImli: local.totalReturnedQuantity } },
                { upsert: true }
            );

            await localData.findOneAndUpdate(
                { LocalID: localId },
                {
                    $inc: { totalPaidAmount: total },
                    $set: { totalAssignedQuantity: 0, totalReturnedQuantity: 0 }
                }
            );

            return res.status(200).json(
                new ApiResponse(200, {
                    orderReference: local._id,
                    total,
                    localTotalPaid,
                    method,
                    status: "SUCCESS"
                }, "Online payment confirmed")
            );
        }

        if (status === "REJECTED") {
            await Payment.findOneAndUpdate(
                { _id: pendingPayment._id },
                { $set: { status: "REJECTED" } }
            );

            return res.status(200).json(
                new ApiResponse(200, {
                    orderReference: local._id,
                    method,
                    status: "REJECTED"
                }, "Payment rejected")
            );
        }

        throw new ApiError(400, "Invalid status. Use SUCCESS or REJECTED");
    }

    throw new ApiError(400, "Invalid method. Use Cash or Online");
});


export const logsdetails = asyncHandler(async (req, res) => {
    const { localID } = req.query;

    if (!localID) {
        throw new ApiError(400, "localID is required");
    }

    const logDetails = await logs.find({ LocalID: Number(localID) }).sort({ createdAt: -1 });

    if (!logDetails || logDetails.length === 0) {
        throw new ApiError(404, "No logs found for this localID");
    }

    return res.status(200).json(
        new ApiResponse(200, logDetails, "Log details fetched")
    );
});

export const getAssignmentHistory = asyncHandler(async (req, res) => {
    const { localID } = req.query;

    if (!localID) {
        throw new ApiError(400, "localID is required");
    }

    const assignments = await ImliAssign.find({ localID: String(localID) }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, assignments || [], "Assignment history fetched")
    );
});