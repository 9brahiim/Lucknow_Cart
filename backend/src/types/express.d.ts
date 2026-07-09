import { Types } from "mongoose";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      role: "customer" | "admin";
      _id?: Types.ObjectId;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
