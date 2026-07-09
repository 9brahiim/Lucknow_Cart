import { body } from "express-validator";

export const vendorValidation = [
  body("shopName").trim().notEmpty().withMessage("Shop name is required"),
  body("ownerName").trim().notEmpty().withMessage("Owner name is required"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];
