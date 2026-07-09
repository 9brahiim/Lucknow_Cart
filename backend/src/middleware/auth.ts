import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

interface JwtPayload {
  userId: string;
  role: "customer" | "admin";
}

export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(new AppError("Unauthorized. Token missing.", 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch {
    return next(new AppError("Invalid or expired token.", 401));
  }
};

export const authorize = (...roles: Array<"customer" | "admin">) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. Insufficient permissions.", 403));
    }
    return next();
  };
};
