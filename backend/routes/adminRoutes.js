import express from "express";
import { protect,isAdmin } from "../midddleware/authMiddleware.js";
//import { isAdmin } from "../midddleware/uploadMiddleware.js";
import { getAllFiles, adminDeleteFile, getPlatformStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/files", protect, isAdmin, getAllFiles);
router.delete("/files/:id", protect, isAdmin, adminDeleteFile);
router.get("/stats", protect, isAdmin, getPlatformStats);

export default router;
