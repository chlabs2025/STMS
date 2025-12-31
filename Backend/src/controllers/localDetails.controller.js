import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { localData } from "../models/local.model.js";

export const getlocalData = asyncHandler(async (req, res) => {
  const locals = await localData
    .find()
    .select("LocalID LocalName");
   
    return res.json(
    new ApiResponse(
      200,
      locals,
      "Local details fetched successfully"
    )
  );
});
