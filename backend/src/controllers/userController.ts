import { Request, Response } from "express";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";
import { uploadImage } from "../config/cloudinary";

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name, imageBase64 } = req.body as { name?: string; imageBase64?: string };
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (name) user.name = name;
  if (imageBase64) user.profileImage = await uploadImage(imageBase64, "lucknow-cart/users");

  await user.save();
  res.json(apiResponse("Profile updated successfully", user));
});

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(apiResponse("Users fetched successfully", users));
});
