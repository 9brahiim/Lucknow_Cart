import { Router } from "express";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  updateVendor,
} from "../controllers/vendorController";
import { authorize, protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { vendorValidation } from "../validators/vendorValidators";

const router = Router();

router.get("/", getVendors);
router.get("/:id", getVendorById);
router.post("/", protect, authorize("admin"), vendorValidation, validateRequest, createVendor);
router.put("/:id", protect, authorize("admin"), vendorValidation, validateRequest, updateVendor);
router.delete("/:id", protect, authorize("admin"), deleteVendor);

export default router;
