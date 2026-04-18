import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logActivity } from "./activity.controller.js";
import { ApiError } from "../utils/ApiError.js";

import { localData } from "../models/local.model.js";
import { imliReturn } from "../models/imliReturn.model.js";

export const returnImli = asyncHandler(async (req, res) => {
  const { LocalID, returnedQuantity } = req.body;

  if (!LocalID) throw new ApiError(400, "LocalID is required");
  if (!returnedQuantity)
    throw new ApiError(400, "returnedQuantity is required");

  const local = await localData.findOne({
    LocalID: LocalID,
  });

  if (!local) throw new ApiError(404, "Local not found");

  if (returnedQuantity > local.totalAssignedQuantity) {
    throw new ApiError(
      400,
      "Returned quantity cannot exceed assigned quantity"
    );
  }

  // Sirf totalReturnedQuantity badhao, totalAssignedQuantity ko mat chhuo
  const updatedLocal = await localData.findOneAndUpdate(
    { LocalID },
    { $inc: { totalReturnedQuantity: returnedQuantity } },
    { returnDocument: 'after' }
  );

  // Update global cleaned imli stock
  await ImliData.findOneAndUpdate(
    {},
    { $inc: { totalCleanedImli: returnedQuantity } },
    { upsert: true }
  );

  const returned = await imliReturn.create({
    localID: local.LocalID,
    localName: local.LocalName,
    returnedQuantity,
  });

  await logActivity({
    type: "RETURN",
    description: `Received ${returnedQuantity} KG from ${local.LocalName}`,
    quantity: returnedQuantity,
    localName: local.LocalName,
  });

  return res.json(
    new ApiResponse(
      200,
      {
        returned: returned,
        totalAssignedQuantity: updatedLocal.totalAssignedQuantity,
        totalReturnedQuantity: updatedLocal.totalReturnedQuantity,
      },
      "Imli returned successfully"
    )
  );
});
