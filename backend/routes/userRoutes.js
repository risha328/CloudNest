import express from "express";
import { searchUsers, getUserById, updateSubscription } from "../controllers/userController.js";
import { protect } from "../midddleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserById);
router.put("/subscription", protect, updateSubscription);

export default router;
