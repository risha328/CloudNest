import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { createFolder, getFolders } from "../controllers/folderController.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createFolder);
router.get("/", protect, getFolders);

export default router;
