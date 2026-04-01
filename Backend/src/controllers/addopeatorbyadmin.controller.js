import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const addOperatorbyadmin = asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        throw new ApiError(400, "Both name and password are required");
    }

    const newOperator = await User.create({
        username: name,
        password: password,
        role: "operator"
    });

    const operatorResponse = newOperator.toObject();
    delete operatorResponse.password;

    return res.status(201).json(
        new ApiResponse(201, operatorResponse, "Operator created successfully")
    );
});

export { addOperatorbyadmin };
