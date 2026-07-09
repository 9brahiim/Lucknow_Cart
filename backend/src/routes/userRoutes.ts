import { Router } from "express";
import { getAllUsers, updateProfile } from "../controllers/userController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.put("/profile", protect, updateProfile);
router.get("/", protect, authorize("admin"), getAllUsers);

export default router;
