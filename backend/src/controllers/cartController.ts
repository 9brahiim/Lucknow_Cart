import { Request, Response } from "express";
import { Types } from "mongoose";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId).populate("cart.product");
  if (!user) throw new AppError("User not found", 404);
  res.json(apiResponse("Cart fetched successfully", user.cart));
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body as { productId: string; quantity: number };
  const [user, product] = await Promise.all([
    User.findById(req.user?.userId),
    Product.findById(productId),
  ]);

  if (!user) throw new AppError("User not found", 404);
  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < quantity) throw new AppError("Insufficient stock", 400);

  const existing = user.cart.find((item) => item.product.toString() === productId);
  if (existing) {
    existing.quantity = quantity;
  } else {
    user.cart.push({ product: product._id as Types.ObjectId, quantity });
  }

  await user.save();
  await user.populate("cart.product");
  res.json(apiResponse("Cart updated successfully", user.cart));
});

export const updateCartQuantity = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = req.body as { quantity: number };
  const productId = req.params.productId;
  const [user, product] = await Promise.all([
    User.findById(req.user?.userId),
    Product.findById(productId),
  ]);

  if (!user) throw new AppError("User not found", 404);
  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < quantity) throw new AppError("Insufficient stock", 400);

  const cartItem = user.cart.find((item) => item.product.toString() === productId);
  if (!cartItem) throw new AppError("Item not found in cart", 404);

  cartItem.quantity = quantity;
  await user.save();
  await user.populate("cart.product");
  res.json(apiResponse("Cart quantity updated", user.cart));
});

export const removeCartItem = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) throw new AppError("User not found", 404);

  user.cart = user.cart.filter((item) => item.product.toString() !== req.params.productId);
  await user.save();
  await user.populate("cart.product");
  res.json(apiResponse("Item removed from cart", user.cart));
});

export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) throw new AppError("User not found", 404);
  user.cart = [];
  await user.save();
  res.json(apiResponse("Cart cleared successfully"));
});
