import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import { authorize, protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { productValidation } from "../validators/productValidators";

const router = Router();

router.get("/", getProducts);
router.get("/featured/list", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("admin"), productValidation, validateRequest, createProduct);
router.put("/:id", protect, authorize("admin"), productValidation, validateRequest, updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
