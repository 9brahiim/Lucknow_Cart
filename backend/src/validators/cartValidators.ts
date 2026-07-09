import { body } from "express-validator";

export const cartItemValidation = [
  body("productId").isMongoId().withMessage("Valid product id is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity should be at least 1"),
];
