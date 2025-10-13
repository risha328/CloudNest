import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { upload } from "../midddleware/uploadMiddleware.js";
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
router.get("/", protect, getFilesByFolder);
router.get("/storage/stats", protect, getStorageStats);
router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:id", protect, getFileById);
router.get("/:id/metadata", protect, getFileMetadata);
router.delete("/:id", protect, deleteFile);

// Protected access routes
router.post("/:id/access", protect, accessFile);
router.get("/:id/view", protect, viewFile);
router.get("/:id/download", protect, downloadFile);

router.put("/:id", protect, upload.single("file"), updateFile);
router.get("/:id/versions", protect, getVersions);
router.post("/:id/restore/:version", protect, restoreVersion);
router.post("/:id/set-expiry", protect, setExpiry);
router.post("/:id/reset-password", protect, resetPassword);
router.get("/:id/stats", protect, getFileStats);
router.get("/folders/:folderId/analytics", protect, getFolderAnalytics);
export default router;
