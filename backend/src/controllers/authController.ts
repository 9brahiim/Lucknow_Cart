import { Request, Response } from "express";
import { IUser, User } from "../models/User";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";
import { signToken } from "../utils/jwt";

const buildAuthPayload = (user: IUser) => {
  const userId = user.id;
  const token = signToken(userId, user.role);
  return {
    token,
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || "",
    },
  };
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError("User with this email already exists", 409);
  }

  const user = await User.create({ name, email, password, role: "customer" });
  res.status(201).json(apiResponse("Registration successful", buildAuthPayload(user)));
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json(apiResponse("Login successful", buildAuthPayload(user)));
});

export const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  if (!user || user.role !== "admin") {
    throw new AppError("Admin credentials are invalid", 401);
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    throw new AppError("Admin credentials are invalid", 401);
  }

  res.json(apiResponse("Admin login successful", buildAuthPayload(user)));
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json(apiResponse("Profile fetched", user));
});
