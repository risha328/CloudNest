import express from "express";
import { signup, login, getMe, adminSignup, adminLogin } from "../controllers/authController.js";
import { protect } from "../midddleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

export default router;
