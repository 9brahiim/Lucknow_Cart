import { Document, Schema, Types, model } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  name: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  products: IOrderItem[];
  totalPrice: number;
  orderStatus: OrderStatus;
  address?: string;
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        name: { type: String, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
