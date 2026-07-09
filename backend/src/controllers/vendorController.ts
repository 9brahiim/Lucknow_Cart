import { Request, Response } from "express";
import { Vendor } from "../models/Vendor";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";
import { uploadImage } from "../config/cloudinary";

export const getVendors = catchAsync(async (req: Request, res: Response) => {
  const { category, search } = req.query as { category?: string; search?: string };
  const filter: Record<string, unknown> = {};

  if (category) filter.category = category;
  if (search) filter.shopName = { $regex: search, $options: "i" };

  const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
  res.json(apiResponse("Vendors fetched successfully", vendors));
});

export const getVendorById = catchAsync(async (req: Request, res: Response) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) throw new AppError("Vendor not found", 404);
  res.json(apiResponse("Vendor details fetched", vendor));
});

export const createVendor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Record<string, string>;
  if (payload.imageBase64) {
    payload.image = await uploadImage(payload.imageBase64, "lucknow-cart/vendors");
    delete payload.imageBase64;
  }
  const vendor = await Vendor.create(payload);
  res.status(201).json(apiResponse("Vendor created successfully", vendor));
});

export const updateVendor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Record<string, string>;
  if (payload.imageBase64) {
    payload.image = await uploadImage(payload.imageBase64, "lucknow-cart/vendors");
    delete payload.imageBase64;
  }

  const vendor = await Vendor.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!vendor) throw new AppError("Vendor not found", 404);
  res.json(apiResponse("Vendor updated successfully", vendor));
});

export const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) throw new AppError("Vendor not found", 404);
  res.json(apiResponse("Vendor deleted successfully"));
});
