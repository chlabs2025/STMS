import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Config } from "../models/config.model.js"
import { localData } from "../models/local.model.js"
import { logs } from "../models/logs.model.js"
import { ImliData } from "../models/imli.model.js"
import { ImliAssign } from "../models/imliAssign.model.js"
import { imliReturn } from "../models/imliReturn.model.js"

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
    const { localID, assignmentId, assignmentIds } = req.body;

    if (!localID) throw new ApiError(400, "localID required");

    const local = await localData.findOne({ LocalID: localID });
    if (!local) throw new ApiError(404, "Local not found");

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    // Cumulative multi-batch payment
    if (assignmentIds && assignmentIds.length > 0) {
        const batches = await imliReturn.find({ _id: { $in: assignmentIds } }).populate("assignmentIds");
        if (!batches || batches.length === 0) throw new ApiError(404, "Return batches not found");

        const alreadyPaid = batches.filter(b => b.isPaid);
        if (alreadyPaid.length > 0) throw new ApiError(400, "Some batches have already been paid");

        const totalCleaned = batches.reduce((sum, b) => sum + (b.returnedQuantity || 0), 0);
        if (totalCleaned <= 0) throw new ApiError(404, "No pending returns for these batches");

        const totalRaw = batches.reduce((sum, b) => {
            return sum + (b.assignmentIds || []).reduce((s, a) => s + (a.assignedQuantity || 0), 0);
        }, 0);
        const total = totalCleaned * p.price_per_cleaned_imli;

        return res.status(200).json(
            new ApiResponse(200, {
                orderReference: batches.map(b => b._id).join(","),
                assignmentIds: batches.map(b => b._id),
                quantity: totalCleaned,
                assignedQuantity: totalRaw,
                price_per_cleaned_imli: p.price_per_cleaned_imli,
                total,
            }, "Order details fetched for cumulative batches")
        );
    }

    // Per-assignment (batch) payment — backward compat
    if (assignmentId) {
        const batch = await imliReturn.findById(assignmentId).populate("assignmentIds");
        if (!batch) throw new ApiError(404, "Return batch not found");

        if (batch.isPaid) {
            throw new ApiError(400, "This return batch has already been paid");
        }

        const cleanedQty = batch.returnedQuantity || 0;
        if (cleanedQty <= 0) {
            throw new ApiError(404, "No pending return for this batch");
        }

        const totalRaw = (batch.assignmentIds || []).reduce((sum, a) => sum + (a.assignedQuantity || 0), 0);
        const total = cleanedQty * p.price_per_cleaned_imli;

        return res.status(200).json(
            new ApiResponse(200, {
                orderReference: batch._id,
                assignmentId: batch._id,
                assignmentIds: [batch._id],
                quantity: cleanedQty,
                assignedQuantity: totalRaw,
                price_per_cleaned_imli: p.price_per_cleaned_imli,
                total,
            }, "Order details fetched for return batch")
        );
    }

    // Fallback: overall (backward compatibility)
    if (!local.totalReturnedQuantity || local.totalReturnedQuantity <= 0) {
        throw new ApiError(404, "No pending return for this local");
    }

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
    const { localId, method, status, assignmentId, assignmentIds } = req.body;

    if (!localId || !method) throw new ApiError(400, "localId and method are required");

    const local = await localData.findOne({ LocalID: localId });
    if (!local) throw new ApiError(404, "Local not found");

    const p = await Config.findOne();
    if (!p) throw new ApiError(404, "Price config not found");

    let payableQty, assignedQty;
    // Resolve which batch IDs to process
    const batchIdsToProcess = (assignmentIds && assignmentIds.length > 0) ? assignmentIds : (assignmentId ? [assignmentId] : null);

    if (batchIdsToProcess) {
        const batches = await imliReturn.find({ _id: { $in: batchIdsToProcess } }).populate("assignmentIds");
        if (!batches || batches.length === 0) throw new ApiError(404, "Return batches not found");

        const alreadyPaid = batches.filter(b => b.isPaid);
        if (alreadyPaid.length > 0) throw new ApiError(400, "Some batches have already been paid");

        payableQty = batches.reduce((sum, b) => sum + (b.returnedQuantity || 0), 0);
        assignedQty = batches.reduce((sum, b) => {
            return sum + (b.assignmentIds || []).reduce((s, a) => s + (a.assignedQuantity || 0), 0);
        }, 0);

        if (payableQty <= 0) {
            throw new ApiError(404, "No pending return for these batches");
        }
    } else {
        // Fallback: overall
        payableQty = local.totalReturnedQuantity || 0;
        assignedQty = local.totalAssignedQuantity || 0;

        if (payableQty <= 0) {
            throw new ApiError(404, "No pending return for payment");
        }
    }

    const total = payableQty * p.price_per_cleaned_imli;
    const localTotalPaid = (local.totalPaidAmount || 0) + total;

    // ─── CASH: direct SUCCESS ───
    if (method === "Cash") {
        await Payment.create({
            local: local._id,
            localID: localId,
            method,
            amount: total,
            status: "SUCCESS"
        });

        const refId = batchIdsToProcess ? batchIdsToProcess.join(",") : local._id.toString();
        await logs.create({
            orderReference: refId,
            LocalID: localId,
            period: new Date(),
            assignedQty: assignedQty,
            cleanedQty: payableQty,
            rate: p.price_per_cleaned_imli,
            totalAmount: total,
            paymentMethod: "Cash",
            paymentStatus: "SUCCESS"
        });

        if (batchIdsToProcess) {
            // Mark all batches as paid
            await imliReturn.updateMany(
                { _id: { $in: batchIdsToProcess } },
                { $set: { isPaid: true } }
            );
        }
        // Update local totals
        await localData.findOneAndUpdate(
            { LocalID: localId },
            { $inc: { totalPaidAmount: total, totalReturnedQuantity: -payableQty } }
        );

        return res.status(201).json(
            new ApiResponse(201, {
                orderReference: refId,
                assignmentIds: batchIdsToProcess || [],
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

            const refId = batchIdsToProcess ? batchIdsToProcess.join(",") : local._id.toString();
            return res.status(200).json(
                new ApiResponse(200, {
                    paymentId: payment._id,
                    orderReference: refId,
                    assignmentIds: batchIdsToProcess || [],
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

            const refId = batchIdsToProcess ? batchIdsToProcess.join(",") : local._id.toString();
            await logs.create({
                orderReference: refId,
                LocalID: localId,
                period: new Date(),
                assignedQty: assignedQty,
                cleanedQty: payableQty,
                rate: p.price_per_cleaned_imli,
                totalAmount: total,
                paymentMethod: "Online",
                paymentStatus: "SUCCESS"
            });

            if (batchIdsToProcess) {
                await imliReturn.updateMany(
                    { _id: { $in: batchIdsToProcess } },
                    { $set: { isPaid: true } }
                );
            }
            await localData.findOneAndUpdate(
                { LocalID: localId },
                { $inc: { totalPaidAmount: total, totalReturnedQuantity: -payableQty } }
            );

            return res.status(200).json(
                new ApiResponse(200, {
                    orderReference: refId,
                    assignmentIds: batchIdsToProcess || [],
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

            const refId = batchIdsToProcess ? batchIdsToProcess.join(",") : local._id.toString();
            return res.status(200).json(
                new ApiResponse(200, {
                    orderReference: refId,
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
        return res.status(200).json(
            new ApiResponse(200, [], "No logs found for this localID")
        );
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

    const local = await localData.findOne({ LocalID: String(localID) });
    if (!local) {
        throw new ApiError(404, "Local not found");
    }

    // Fetch pending assignments (not linked to any return batch)
    const pendingAssignments = await ImliAssign.find({ 
        localID: String(localID),
        returnBatchId: null
    }).sort({ createdAt: 1 });

    const pendingEntries = pendingAssignments.map(a => {
        return {
            _id: a._id,
            type: "assign",
            quantity: a.assignedQuantity,
            returnedQuantity: 0,
            cleanedQuantity: 0,
            remainingQuantity: a.assignedQuantity,
            isReturned: false,
            createdAt: a.createdAt,
        };
    });

    // Fetch grouped return batches and populate their assignments
    const returnBatches = await imliReturn.find({
        localID: String(localID)
    }).populate("assignmentIds").sort({ createdAt: 1 });

    // Fetch successful payment logs for this local to map payment groups
    const paymentLogs = await logs.find({
        LocalID: Number(localID),
        paymentStatus: "SUCCESS"
    });

    const p = await Config.findOne();
    const defaultRate = p?.price_per_cleaned_imli || 15;

    const batchEntries = returnBatches.flatMap(batch => {
        // Map the populated assignments
        const assignmentsData = (batch.assignmentIds || []).map(a => ({
            _id: a._id,
            quantity: a.assignedQuantity,
            createdAt: a.createdAt
        }));

        // The total raw assigned for this batch
        const totalRaw = assignmentsData.reduce((sum, a) => sum + (a.quantity || 0), 0);

        console.log(`[DEBUG] Batch ${batch._id}: assignmentsData.length=${assignmentsData.length}, totalRaw=${totalRaw}, returnedQty=${batch.returnedQuantity}`);
        assignmentsData.forEach((a, i) => console.log(`[DEBUG]   assignment[${i}]: _id=${a._id}, qty=${a.quantity}`));

        // Find if this batch is linked to a payment log
        let matchingLog = paymentLogs.find(log => 
            log.orderReference && log.orderReference.split(",").includes(batch._id.toString())
        );

        if (!matchingLog) {
            // Fallback for legacy payments: check if orderReference matches any of the batch's assignment IDs
            const assignmentStrIds = (batch.assignmentIds || []).map(a => a._id.toString());
            matchingLog = paymentLogs.find(log => 
                log.orderReference && log.orderReference.split(",").some(refId => assignmentStrIds.includes(refId))
            );
        }

        const sharedBatchInfo = {
            batchId: batch._id,
            type: "batch",
            isBatch: true,
            cleanedQuantity: batch.returnedQuantity, // the grouped cleaned quantity
            isReturned: true,
            isPaid: batch.isPaid,
            paymentLogId: matchingLog ? matchingLog._id : (batch.isPaid ? `legacy-${batch._id}` : null),
            paymentDate: matchingLog ? matchingLog.createdAt : batch.createdAt,
            totalAmount: matchingLog ? matchingLog.totalAmount : (batch.returnedQuantity * defaultRate),
            rate: matchingLog ? matchingLog.rate : defaultRate,
        };

        // Emit one row per assignment within the batch
        if (assignmentsData.length > 0) {
            const rows = assignmentsData.map((a, idx) => ({
                _id: a._id,
                ...sharedBatchInfo,
                quantity: a.quantity, // individual assignment quantity
                returnedQuantity: a.quantity, // fully consumed raw
                remainingQuantity: 0,
                // Only show cleaned quantity on the last assignment row to avoid double-counting
                cleanedQuantity: idx === assignmentsData.length - 1 ? batch.returnedQuantity : 0,
                createdAt: a.createdAt, // use the assignment's own timestamp
            }));
            console.log(`[DEBUG]   -> Emitting ${rows.length} rows`);
            return rows;
        }

        // Fallback: if no assignments populated, show batch as single row
        console.log(`[DEBUG]   -> FALLBACK: single row`);
        return [{
            _id: batch._id,
            ...sharedBatchInfo,
            quantity: totalRaw,
            returnedQuantity: totalRaw,
            remainingQuantity: 0,
            createdAt: batch.createdAt,
        }];
    });

    // Combine and sort by createdAt ascending
    const history = [...pendingEntries, ...batchEntries].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return res.status(200).json(
        new ApiResponse(200, history, "Assignment history fetched successfully")
    );
});

