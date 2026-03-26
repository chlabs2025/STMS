import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { ImliData } from "../models/imli.model.js";

export const getRawImli = asyncHandler(async (req, res) => {
  const imli = await ImliData.findOne({});
  const rawImliQuantity = imli ? imli.rawImliQuantity : 0;
  const totalCleanedImli = imli ? imli.totalCleanedImli : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, { rawImliQuantity, totalCleanedImli }, "Imli data fetched successfully")
    );
});

export const addRawImli = asyncHandler(async (req, res) => {
  const { rawImliQuantity } = req.body;

  if (!rawImliQuantity) throw new ApiError(400, "imli quantity is required");
  if (rawImliQuantity < 0) throw new ApiError(400, "imli quantity cannt be negative");


  const imli = await ImliData.findOneAndUpdate(
    {},
    { $inc: { rawImliQuantity } }, // add quantity
    {
      returnDocument: 'after', // return updated doc
      upsert: true, // create if not exists (first time)
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        imli,
        "raw Imli added successfully"
      )
    )
});
