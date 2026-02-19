import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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

  //   if (!activeAssign) {
  //     throw new ApiError(400, "No active imli assignment found for this local");
  //   }

  if (returnedQuantity > local.totalAssignedQuantity) {
    throw new ApiError(
      400,
      "Returned quantity cannot exceed assigned quantity"
    );
  }

  // Decrease totalAssignedQuantity from Local
  const updatedLocal = await localData.findOneAndUpdate(
    { LocalID },
    { $inc: { totalAssignedQuantity: -returnedQuantity } },
    { returnDocument: 'after' }
  );

  const totalReturnedQuantity = await localData.findOneAndUpdate(
    { LocalID },
    { $inc: { totalReturnedQuantity: returnedQuantity } },
    { returnDocument: 'after' }
  );

  const returned = await imliReturn.create({
    localID: local.LocalID,
    localName: local.LocalName,
    returnedQuantity,
  });

  return res.json(
    new ApiResponse(
      200,
      {
        returned: returned,
        totalAssignedQuantity: updatedLocal.totalAssignedQuantity,
        totalReturnedQuantity: totalReturnedQuantity.totalReturnedQuantity,
      },
      "Imli returned successfully"
    )
  );
});
