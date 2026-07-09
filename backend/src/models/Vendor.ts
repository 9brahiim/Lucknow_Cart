import { Document, Schema, model } from "mongoose";

export interface IVendor extends Document {
  shopName: string;
  ownerName: string;
  address: string;
  phone: string;
  category: string;
  image?: string;
}

const vendorSchema = new Schema<IVendor>(
  {
    shopName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Vendor = model<IVendor>("Vendor", vendorSchema);
