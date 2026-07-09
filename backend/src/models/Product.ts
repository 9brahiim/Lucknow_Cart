import { Document, Schema, Types, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  vendor: Types.ObjectId;
  featured: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
