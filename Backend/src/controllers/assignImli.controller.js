import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ImliData } from "../models/imli.model.js";
import { ImliAssign } from "../models/imliAssign.model.js";
import { logActivity } from "./activity.controller.js";
import { localData } from "../models/local.model.js";

export const assignImli = asyncHandler(async (req, res) => {
  const { LocalID, assignedQuantity } = req.body;

  if (!LocalID) throw new ApiError(400, "LocalID is required");
  if (!assignedQuantity)
    throw new ApiError(400, "assignedQuantity is required");

  const stock = await ImliData.findOne();

  if (!stock) {
    throw new ApiError(400, "No stock found. Please add Raw Imli first.");
  }
  if (stock.rawImliQuantity < assignedQuantity) {
    throw new ApiError(400, `Not enough imli in stock. Available: ${stock.rawImliQuantity}, Requested: ${assignedQuantity}`);
  }

  await ImliData.findOneAndUpdate(
    {},
    { $inc: { rawImliQuantity: -assignedQuantity } }
  );

  const local = await localData.findOne({ LocalID });
  if (!local) throw new ApiError(404, "Local not found");

  const assign = await ImliAssign.create({
    localID: local.LocalID,
    localName: local.LocalName,
    assignedQuantity,

    assignedBy: req.user.username, // admin or operator
  });

  const totalAssignedQuantity = await localData.findOneAndUpdate(
    { LocalID },
    { $inc: { totalAssignedQuantity: assignedQuantity } },
    { returnDocument: 'after' }
  );

  return res.json(
    new ApiResponse(
      201,
      {
        assign: assign,
        totalAssignedQuantity: totalAssignedQuantity.totalAssignedQuantity
      },
      "Imli assigned successfully"
    )
  );
});
