import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";
import { protect } from "../midddleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:fileId", protect, getComments);
router.delete("/:id", protect, deleteComment);

export default router;
