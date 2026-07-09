import { Request, Response } from "express";
import { Product } from "../models/Product";
import { AppError } from "../utils/AppError";
import { apiResponse } from "../utils/apiResponse";
import { catchAsync } from "../utils/catchAsync";
import { uploadImage } from "../config/cloudinary";

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const { search, category, vendor } = req.query as {
    search?: string;
    category?: string;
    vendor?: string;
  };

  const filter: Record<string, unknown> = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (vendor) filter.vendor = vendor;

  const products = await Product.find(filter).populate("vendor").sort({ createdAt: -1 });
  res.json(apiResponse("Products fetched successfully", products));
});

export const getFeaturedProducts = catchAsync(async (_req: Request, res: Response) => {
  const products = await Product.find({ featured: true }).populate("vendor").limit(8).sort({ createdAt: -1 });
  res.json(apiResponse("Featured products fetched", products));
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("vendor");
  if (!product) throw new AppError("Product not found", 404);
  res.json(apiResponse("Product details fetched", product));
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Record<string, string | number | boolean>;
  if (typeof payload.imageBase64 === "string") {
    payload.image = await uploadImage(payload.imageBase64, "lucknow-cart/products");
    delete payload.imageBase64;
  }
  const product = await Product.create(payload);
  res.status(201).json(apiResponse("Product created successfully", product));
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body as Record<string, string | number | boolean>;
  if (typeof payload.imageBase64 === "string") {
    payload.image = await uploadImage(payload.imageBase64, "lucknow-cart/products");
    delete payload.imageBase64;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!product) throw new AppError("Product not found", 404);
  res.json(apiResponse("Product updated successfully", product));
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  res.json(apiResponse("Product deleted successfully"));
});
