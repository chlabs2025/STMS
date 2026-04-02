import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ImliData } from "../models/imli.model.js";
import { logActivity } from "./activity.controller.js";

export const addCleanedImli = asyncHandler(async (req, res) => {
  const { cleanedImliQuantity } = req.body;

  if (!cleanedImliQuantity)
    throw new ApiError(400, "cleanedImliQuantity is required");
  if (cleanedImliQuantity < 0)
    throw new ApiError(400, "cleanedImliQuantity cannot be negative");

  const imli = await ImliData.findOneAndUpdate(
    {},
    { $inc: { totalCleanedImli: cleanedImliQuantity } },
    {
      returnDocument: "after",
      upsert: true,
    }
  );

  await logActivity({
    type: "CLEANED_RESTOCK",
    description: `Added ${cleanedImliQuantity} KG of cleaned Imli to stock`,
    quantity: cleanedImliQuantity,
    actor: "Admin",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCleanedImli: imli.totalCleanedImli },
        "Cleaned Imli added successfully"
      )
    );
});
