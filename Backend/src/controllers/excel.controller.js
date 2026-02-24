import {localData} from "../models/local.model.js"
import {logs} from "../models/logs.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {xlslhandler} from "../service/xlsl.service.js"

const paymentxlsl = asyncHandler(async (req, res) => {

    const paymentlog = await logs.find().lean();

    if (paymentlog.length === 0) {
        throw new ApiError(404, "No payment data found");
    }

    const buffer = xlslhandler(paymentlog, "Payments");

    res.setHeader("Content-Disposition", "attachment; filename=payments.xlsx");
    res.send(buffer);
});

const localxlsl = asyncHandler(async (req, res) => {

    const allData = await localData.find().lean();

    if (allData.length === 0) {
        throw new ApiError(404, "No local data found");
    }

    const buffer = xlslhandler(allData, "LocalData");

    res.setHeader("Content-Disposition", "attachment; filename=localdata.xlsx");
    res.send(buffer);
});

const specificxlsluser = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    const data = await localData.find({ userId }).lean();

    if (data.length === 0) {
        throw new ApiError(404, "No data for this user");
    }

    const buffer = xlslhandler(data, "UserData");

    res.setHeader("Content-Disposition", `attachment; filename=user-${userId}.xlsx`);
    res.send(buffer);
});