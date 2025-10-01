import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { upload } from "../midddleware/uploadMiddleware.js";
import {
  uploadFile,
  getFileMetadata,
  accessFile,
  downloadFile,
  deleteFile
} from "../controllers/fileController.js";

const router = express.Router();

// Authenticated routes
router.post("/", protect, upload.single("file"), uploadFile);
router.get("/:id/metadata", protect, getFileMetadata);
router.delete("/:id", protect, deleteFile);

// Public access routes
router.post("/:id/access", accessFile);
router.get("/:id/download", downloadFile);

export default router;
