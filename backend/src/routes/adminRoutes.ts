import { Router } from "express";
import { getDashboardStats } from "../controllers/adminController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);

export default router;
