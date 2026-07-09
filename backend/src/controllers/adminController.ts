import { Request, Response } from "express";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";
import { Vendor } from "../models/Vendor";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";

export const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const [totalProducts, totalVendors, totalUsers, totalOrders, recentOrders] = await Promise.all([
    Product.countDocuments(),
    Vendor.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email"),
  ]);

  res.json(
    apiResponse("Dashboard stats fetched", {
      totalProducts,
      totalVendors,
      totalUsers,
      totalOrders,
      recentOrders,
    })
  );
});
