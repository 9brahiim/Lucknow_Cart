import { Request, Response } from "express";
import { Types } from "mongoose";
import { Order, OrderStatus } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";

export const checkout = catchAsync(async (req: Request, res: Response) => {
  const { address } = req.body as { address?: string };
  const user = await User.findById(req.user?.userId).populate("cart.product");
  if (!user) throw new AppError("User not found", 404);
  if (user.cart.length === 0) throw new AppError("Cart is empty", 400);

  const orderItems: Array<{ product: Types.ObjectId; quantity: number; unitPrice: number; name: string }> = [];
  let totalPrice = 0;

  for (const item of user.cart) {
    const productDoc = await Product.findById(item.product);
    if (!productDoc) throw new AppError("One or more products are unavailable", 400);
    if (productDoc.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${productDoc.name}`, 400);
    }

    productDoc.stock -= item.quantity;
    await productDoc.save();

    const unitPrice = productDoc.price;
    totalPrice += unitPrice * item.quantity;
    orderItems.push({
      product: productDoc._id as Types.ObjectId,
      quantity: item.quantity,
      unitPrice,
      name: productDoc.name,
    });
  }

  const order = await Order.create({
    user: user._id,
    products: orderItems,
    totalPrice,
    orderStatus: "pending",
    address: address || "",
  });

  user.cart = [];
  await user.save();

  res.status(201).json(apiResponse("Order placed successfully", order));
});

export const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user?.userId }).sort({ createdAt: -1 }).populate("products.product");
  res.json(apiResponse("Order history fetched", orders));
});

export const getAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
  res.json(apiResponse("Orders fetched successfully", orders));
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderStatus } = req.body as { orderStatus: OrderStatus };
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
  if (!order) throw new AppError("Order not found", 404);
  res.json(apiResponse("Order status updated", order));
});
