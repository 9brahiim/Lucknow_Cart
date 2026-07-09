import { Router } from "express";
import { body } from "express-validator";
import {
  checkout,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import { authorize, protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";

const router = Router();

router.use(protect);

router.post("/checkout", checkout);
router.get("/my", getMyOrders);
router.get("/", authorize("admin"), getAllOrders);
router.patch(
  "/:id/status",
  authorize("admin"),
  body("orderStatus")
    .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
  validateRequest,
  updateOrderStatus
);

export default router;
