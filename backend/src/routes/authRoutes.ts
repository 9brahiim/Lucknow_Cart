import { Router } from "express";
import { adminLogin, getMe, login, register } from "../controllers/authController";
import { protect } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { loginValidation, registerValidation } from "../validators/authValidators";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/admin/login", loginValidation, validateRequest, adminLogin);
router.get("/me", protect, getMe);

export default router;
