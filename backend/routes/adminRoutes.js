import express from "express";
import { protect,isAdmin } from "../midddleware/authMiddleware.js";
//import { isAdmin } from "../midddleware/uploadMiddleware.js";
import { getAllFiles, adminDeleteFile, getPlatformStats, getAllUsers, getAllFolders, getStorageDetails, getAnalyticsData, getDashboardAnalytics, getAdminSettings, updateAdminSettings } from "../controllers/adminController.js";

const router = express.Router();

router.get("/files", protect, isAdmin, getAllFiles);
router.delete("/files/:id", protect, isAdmin, adminDeleteFile);
router.get("/folders", protect, isAdmin, getAllFolders);
router.get("/users", protect, isAdmin, getAllUsers);
router.get("/stats", protect, isAdmin, getPlatformStats);
router.get("/storage", protect, isAdmin, getStorageDetails);
router.get("/analytics", protect, isAdmin, getAnalyticsData);
router.get("/dashboard-analytics", protect, isAdmin, getDashboardAnalytics);

// Settings routes
router.get("/settings", protect, isAdmin, getAdminSettings);
router.put("/settings", protect, isAdmin, updateAdminSettings);

export default router;
