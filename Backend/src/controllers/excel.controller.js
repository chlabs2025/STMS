import { localData } from "../models/local.model.js";
import { logs } from "../models/logs.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { xlslhandler } from "../service/xlsl.service.js";

const XLSX_CONTENT_TYPE =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const paymentxlsl = asyncHandler(async (req, res) => {
    const paymentlog = await logs.find().lean();

    if (paymentlog.length === 0) {
        throw new ApiError(404, "No payment data found");
    }

    const buffer = xlslhandler(paymentlog, "Payments");

    res.setHeader("Content-Type", XLSX_CONTENT_TYPE);
    res.setHeader("Content-Disposition", "attachment; filename=payments.xlsx");
    res.send(buffer);
});

export const localxlsl = asyncHandler(async (req, res) => {
    const allData = await localData.find().lean();

    if (allData.length === 0) {
        throw new ApiError(404, "No local data found");
    }

    const buffer = xlslhandler(allData, "LocalData");

    res.setHeader("Content-Type", XLSX_CONTENT_TYPE);
    res.setHeader("Content-Disposition", "attachment; filename=localdata.xlsx");
    res.send(buffer);
});

export const specificxlsluser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const data = await localData.find({ userId }).lean();

    if (data.length === 0) {
        throw new ApiError(404, "No data for this user");
    }

    const buffer = xlslhandler(data, "UserData");

    res.setHeader("Content-Type", XLSX_CONTENT_TYPE);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=user-${userId}.xlsx`
    );
    res.send(buffer);
});