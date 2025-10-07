import express from "express";
import { protect } from "../midddleware/authMiddleware.js";
import { createFolder, getFolders, deleteFolder, toggleFavorite, getFavorites } from "../controllers/folderController.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createFolder);
router.get("/", protect, getFolders);
router.delete("/:id", protect, deleteFolder);
router.post("/:id/favorite", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

export default router;
