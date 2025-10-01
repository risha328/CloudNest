import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import File from "../models/File.js";

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const { password, expiresAt } = req.body;
    if (!req.file) 
        return res.status(400).json({ message: "File is required" });

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const file = await File.create({
      ownerId: req.user._id,
      originalName: req.file.originalname,
      storageName: req.file.filename,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      passwordHash,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    res.status(201).json({
      message: "File uploaded successfully",
      fileId: file._id,
      downloadLink: `/api/files/${file._id}/access`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get metadata (owner only)
export const getFileMetadata = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) 
        return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) 
        return res.status(403).json({ message: "Forbidden" });

    res.json({
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      downloadCount: file.downloadCount,
      createdAt: file.createdAt,
      expiresAt: file.expiresAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify password & grant access
export const accessFile = async (req, res) => {
  try {
    const { password } = req.body;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (file.blocked) return res.status(403).json({ message: "File is blocked" });

    if (file.passwordHash) {
      if (!password) return res.status(400).json({ message: "Password required" });
      const isMatch = await bcrypt.compare(password, file.passwordHash);
      if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    }

    // Grant access: return download URL
    res.json({ downloadUrl: `/api/files/${file._id}/download` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (file.blocked) return res.status(403).json({ message: "File is blocked" });

    // Increment download count
    file.downloadCount += 1;
    await file.save();

    res.download(path.resolve(file.path), file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete file (owner only)
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    // Delete file from filesystem
    fs.unlinkSync(path.resolve(file.path));
    await file.remove();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
