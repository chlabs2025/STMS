import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { localData } from "../models/local.model.js";

export const addLocal = asyncHandler(async(req,res)=>{
    const {LocalID, LocalName, LocalAddress, LocalPhone, LocalUPI} = req.body;

//     if (!LocalID || !LocalName || !LocalAddress || !LocalPhone) {
//     throw new ApiError(400, "All required fields must be provided");
//   }

  
  const existingLocal = await localData.findOne({ LocalID });
  if (existingLocal) {
    throw new ApiError(409, "Local already exists");
  }

  
  const local = await localData.create({
    LocalID,
    LocalName,
    LocalAddress,
    LocalPhone,
    LocalUPI
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      local,
      "Local added successfully"
    )
  );
});
