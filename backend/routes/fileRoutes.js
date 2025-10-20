import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { upload, checkServerStorage } from "../midddleware/uploadMiddleware.js";
import { apiRateLimiter, uploadRateLimiter, downloadRateLimiter, bandwidthMonitor } from "../midddleware/rateLimitMiddleware.js";
import {
  uploadFile,
  getFileById,
  getFileMetadata,
  accessFile,
  viewFile,
  downloadFile,
  deleteFile,
    setExpiry,
    resetPassword,
    getFileStats,
    getFilesByFolder,
    getStorageStats,
    getFolderAnalytics,
    updateFile,
    getVersions,
    restoreVersion,
    publicAccessFile,
    publicViewFile,
    publicDownloadFile
} from "../controllers/fileController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/public/:id/access", publicAccessFile);
router.get("/public/:id/view", publicViewFile);
router.get("/public/:id/download", publicDownloadFile);

// Authenticated routes
router.get("/", protect, apiRateLimiter, getFilesByFolder);
router.get("/storage/stats", protect, apiRateLimiter, getStorageStats);
router.post("/", protect, apiRateLimiter, uploadRateLimiter, checkServerStorage, upload.single("file"), uploadFile);
router.get("/:id", protect, apiRateLimiter, getFileById);
router.get("/:id/metadata", protect, apiRateLimiter, getFileMetadata);
router.delete("/:id", protect, apiRateLimiter, deleteFile);

// Protected access routes
router.post("/:id/access", protect, apiRateLimiter, accessFile);
router.get("/:id/view", protect, apiRateLimiter, bandwidthMonitor, viewFile);
router.get("/:id/download", protect, apiRateLimiter, downloadRateLimiter, bandwidthMonitor, downloadFile);

router.put("/:id", protect, apiRateLimiter, uploadRateLimiter, upload.single("file"), updateFile);
router.get("/:id/versions", protect, apiRateLimiter, getVersions);
router.post("/:id/restore/:version", protect, apiRateLimiter, restoreVersion);
router.post("/:id/set-expiry", protect, apiRateLimiter, setExpiry);
router.post("/:id/reset-password", protect, apiRateLimiter, resetPassword);
router.get("/:id/stats", protect, apiRateLimiter, getFileStats);
router.get("/folders/:folderId/analytics", protect, apiRateLimiter, getFolderAnalytics);
export default router;
