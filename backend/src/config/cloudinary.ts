import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { AppError } from "../utils/AppError";

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
});

export const uploadImage = async (image: string, folder: string) => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new AppError("Cloudinary is not configured", 500);
  }

  const result = await cloudinary.uploader.upload(image, {
    folder,
  });
  return result.secure_url;
};
