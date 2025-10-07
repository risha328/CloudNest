import Comment from "../models/Comment.js";
import { checkPermission } from "./permissionController.js";

// Add a comment to a file
export const addComment = async (req, res) => {
  try {
    const { fileId, content } = req.body;
    if (!fileId || !content) return res.status(400).json({ message: "File ID and content are required" });

    // Check if user has permission to view the file
    const hasPermission = await checkPermission(req.user._id, fileId, 'file', 'viewer');
    if (!hasPermission) return res.status(403).json({ message: "Access denied" });

    const comment = new Comment({
      fileId,
      userId: req.user._id,
      content
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a file
export const getComments = async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) return res.status(400).json({ message: "File ID required" });

    // Check if user has permission to view the file
    const hasPermission = await checkPermission(req.user._id, fileId, 'file', 'viewer');
    if (!hasPermission) return res.status(403).json({ message: "Access denied" });

    const comments = await Comment.find({ fileId }).populate('userId', 'name').sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment (owner only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!comment.userId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
