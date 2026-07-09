import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartQuantity,
} from "../controllers/cartController";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { cartItemValidation } from "../validators/cartValidators";
import { body } from "express-validator";

const router = Router();

router.use(protect);

router.get("/", getCart);
router.post("/items", cartItemValidation, validateRequest, addToCart);
router.put(
  "/items/:productId",
  body("quantity").isInt({ min: 1 }).withMessage("Quantity should be at least 1"),
  validateRequest,
  updateCartQuantity
);
router.delete("/items/:productId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
