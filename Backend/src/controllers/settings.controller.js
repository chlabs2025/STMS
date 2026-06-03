import Settings from "../models/settings.model.js";
import { ImliData } from "../models/imli.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { logActivity } from "./activity.controller.js";

export const saveSettings = asyncHandler(async (req, res) => {

  const data = req.body;

  // check if settings already exist
  let settings = await Settings.findOne();

  if (settings) {
    // update existing
    settings = await Settings.findByIdAndUpdate(
      settings._id,
      data,
      { new: true, runValidators: true }
    );
  }
  else {
    // create first time
    settings = await Settings.create(data);
  }

  return res.status(200)
    .json(new ApiResponse(200, settings, "Settings Saved Successfully"));

});

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  return res.status(200)
    .json(new ApiResponse(200, settings || {}, "Settings Fetched Successfully"));
});

export const clearInventory = asyncHandler(async (req, res) => {
  const { clearRaw, clearCleaned } = req.body;

  if (!clearRaw && !clearCleaned) {
    throw new ApiError(400, "Select at least one inventory type to clear.");
  }

  const updateFields = {};
  if (clearRaw) updateFields.rawImliQuantity = 0;
  if (clearCleaned) updateFields.totalCleanedImli = 0;

  const imli = await ImliData.findOneAndUpdate(
    {},
    { $set: updateFields },
    { new: true, upsert: true }
  );

  const cleared = [];
  if (clearRaw) cleared.push("Raw Imli");
  if (clearCleaned) cleared.push("Cleaned Imli");

  await logActivity({
    type: "INVENTORY_CLEARED",
    description: `Inventory reset: ${cleared.join(" & ")} quantity set to 0`,
    quantity: 0,
    actor: "Admin",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { rawImliQuantity: imli.rawImliQuantity, totalCleanedImli: imli.totalCleanedImli },
        `${cleared.join(" & ")} inventory cleared successfully`
      )
    );
});
