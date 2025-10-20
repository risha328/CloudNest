import express from "express";
import { protect, isAdmin } from "../midddleware/authMiddleware.js";
import { getBandwidthStats, resetBandwidthUsage, getFairUseAnalytics } from "../controllers/fairUseController.js";

const router = express.Router();

// Get bandwidth stats for current user
router.get("/bandwidth", protect, getBandwidthStats);

// Admin routes
router.get("/analytics", protect, isAdmin, getFairUseAnalytics);
router.post("/reset-bandwidth/:userId", protect, isAdmin, resetBandwidthUsage);

export default router;
