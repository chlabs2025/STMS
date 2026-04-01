import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const login = asyncHandler(async (req, res) => {
  // Input
  //validate
  // user exist or Not
  // password match
  // if password match give Token
  // login to respective

  const { username, password } = req.body;

  if (!username) throw new ApiError(400, "username is required");
  if (!password) throw new ApiError(400, "password is required");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "password is not correct");

  const generateAccessAndRefereshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken(); //FROM method of user.model.js

      user.refreshToken = refreshToken; //saving in DB
      // await user.save({})  REQUIRED Filled bhi yaha hona chahiye like password etc isliye
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Something went wrong");
    }
  };

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) //app.js => app.use(cookieparser())
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});
