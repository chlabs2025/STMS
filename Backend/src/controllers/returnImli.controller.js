import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logActivity } from "./activity.controller.js";
import { ApiError } from "../utils/ApiError.js";

import { localData } from "../models/local.model.js";
import { imliReturn } from "../models/imliReturn.model.js";
import { ImliData } from "../models/imli.model.js";
import { ImliAssign } from "../models/imliAssign.model.js";

export const returnImli = asyncHandler(async (req, res) => {
  const { LocalID, returnedQuantity, assignmentIds, date } = req.body;

  if (!LocalID) throw new ApiError(400, "LocalID is required");
  if (!returnedQuantity || returnedQuantity <= 0)
    throw new ApiError(400, "returnedQuantity is required");
  if (!assignmentIds || !Array.isArray(assignmentIds) || assignmentIds.length === 0)
    throw new ApiError(400, "Please select at least one assignment");

  const numericLocalID = Number(LocalID);
  if (isNaN(numericLocalID)) throw new ApiError(400, "LocalID must be a valid number");

  const local = await localData.findOne({ LocalID: numericLocalID });
  if (!local) throw new ApiError(404, "Local not found");

  // Fetch selected assignments (oldest first)
  const assignments = await ImliAssign.find({
    _id: { $in: assignmentIds },
    localID: String(numericLocalID),
  }).sort({ createdAt: 1 });

  if (assignments.length === 0) throw new ApiError(404, "No valid assignments found");

  // Check none are already fully returned
  const alreadyReturned = assignments.filter(a => (a.returnedQuantity || 0) >= (a.assignedQuantity || 0));
  if (alreadyReturned.length > 0) {
    throw new ApiError(400, "Some selected assignments are already fully returned");
  }

  // Total raw assigned across selected assignments (for consuming)
  const totalRawAssigned = assignments.reduce((s, a) => s + (a.assignedQuantity || 0), 0);

  // Create the return batch record first to get its ID
  const returnData = {
    localID: local.LocalID,
    localName: local.LocalName,
    returnedQuantity,
    assignmentIds: assignmentIds,
    isPaid: false
  };

  if (date) {
    returnData.createdAt = new Date(date);
  }

  const returned = await imliReturn.create(returnData);

  // Mark ALL selected assignments as fully consumed and link them to the return batch
  for (const assignment of assignments) {
    await ImliAssign.findByIdAndUpdate(assignment._id, {
      $set: {
        returnedQuantity: assignment.assignedQuantity, // fully consumed
        cleanedQuantity: 0, // no longer tracked individually
        returnBatchId: returned._id
      }
    });
  }

  // Update local: decrease totalAssignedQuantity by full raw, increase totalReturnedQuantity by cleaned
  const updatedLocal = await localData.findOneAndUpdate(
    { LocalID: numericLocalID },
    {
      $inc: {
        totalAssignedQuantity: -totalRawAssigned,
        totalReturnedQuantity: returnedQuantity
      }
    },
    { returnDocument: 'after' }
  );

  // Update global cleaned imli stock
  await ImliData.findOneAndUpdate(
    {},
    { $inc: { totalCleanedImli: returnedQuantity } },
    { upsert: true }
  );

  // The returned document is already created above

  await logActivity({
    type: "RETURN",
    description: `Received ${returnedQuantity} KG cleaned from ${local.LocalName} (${assignments.length} assignment${assignments.length > 1 ? 's' : ''} consumed: ${totalRawAssigned} KG raw)`,
    quantity: returnedQuantity,
    localName: local.LocalName,
  });

  return res.json(
    new ApiResponse(200, {
      returned,
      totalAssignedQuantity: updatedLocal.totalAssignedQuantity,
      totalReturnedQuantity: updatedLocal.totalReturnedQuantity,
    }, "Imli returned successfully")
  );
});
