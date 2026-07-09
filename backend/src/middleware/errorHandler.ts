import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
};

export const errorHandler = (
  error: Error & { statusCode?: number; code?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error.code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate value error.",
    });
    return;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Something went wrong",
  });
};
