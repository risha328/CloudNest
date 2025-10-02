import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { upload } from "../midddleware/uploadMiddleware.js";
import {
  uploadFile,
  getFileMetadata,
  accessFile,
  downloadFile,
  deleteFile,
    setExpiry,
    resetPassword,
    getFileStats,
    getFilesByFolder,
    getStorageStats,
    getFolderAnalytics
} from "../controllers/fileController.js";

const router = express.Router();

// Authenticated routes
router.get("/", protect, getFilesByFolder);
router.get("/storage/stats", protect, getStorageStats);
router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:id/metadata", protect, getFileMetadata);
router.delete("/:id", protect, deleteFile);

// Public access routes
router.post("/:id/access", accessFile);
router.get("/:id/download", downloadFile);

router.post("/:id/set-expiry", protect, setExpiry);
router.post("/:id/reset-password", protect, resetPassword);
router.get("/:id/stats", protect, getFileStats);
router.get("/folders/:folderId/analytics", protect, getFolderAnalytics);
export default router;
