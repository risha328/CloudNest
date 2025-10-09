import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
// import ClamScan from "clamscan"; // disabled temporarily
import File from "../models/File.js";
import Folder from "../models/Folder.js";
import Permission from "../models/Permission.js";
import { checkPermission } from "./permissionController.js";

// ClamScan disabled temporarily
// const clamscan = await new ClamScan().init({
//   clamscan: { active: false },
//   clamdscan: { active: false }
// });

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const { password, expiresAt, folderId } = req.body;
    if (!req.file)
        return res.status(400).json({ message: "File is required" });

    // Check file size limits based on plan
    const maxFileSize = req.user.plan === 'pro' ? 5368709120 : 104857600; // 5GB for pro, 100MB for free
    if (req.file.size > maxFileSize) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      const limitText = req.user.plan === 'pro' ? '5GB' : '100MB';
      return res.status(400).json({
        message: `File size exceeds ${limitText} limit for your plan. Please upgrade to Pro for larger files.`
      });
    }

    // Scan file for malware (disabled temporarily)
    /*
    try {
      const scanResult = await clamscan.scan_file(req.file.path);
      if (scanResult.is_infected) {
        // Delete the file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "File contains malware and has been rejected" });
      }
    } catch (scanError) {
      console.error('Scan error:', scanError);
      // Delete file on scan failure for security
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "File scan failed, upload rejected for security" });
    }
    */

    // Check permission if uploading to a folder
    if (folderId) {
      const hasPermission = await checkPermission(req.user._id, folderId, 'folder', 'uploader');
      if (!hasPermission) return res.status(403).json({ message: "Upload denied" });
    }

    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const originalName = req.file.originalname;
    let finalName = originalName;
    // Ensure filename has extension
    if (!path.extname(originalName)) {
      const mime = require('mime-types');
      const ext = mime.extension(req.file.mimetype);
      if (ext) {
        finalName = originalName + '.' + ext;
      }
    }

    const file = await File.create({
      ownerId: req.user._id,
      folderId: folderId || null,
      originalName: finalName,
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

// Get file by ID (owner only)
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file)
        return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id))
        return res.status(403).json({ message: "Forbidden" });

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Check permissions - viewers and above can access
    const hasPermission = await checkPermission(req.user._id, file._id, 'file', 'viewer');
    if (!hasPermission) return res.status(403).json({ message: "Access denied" });

    // Check if user is folder owner (bypasses password)
    let isFolderOwner = false;
    if (file.folderId) {
      const folder = await Folder.findById(file.folderId);
      if (folder && folder.ownerId.equals(req.user._id)) {
        isFolderOwner = true;
      }
    }

    // check expiry
    if (file.expiresAt && new Date() > file.expiresAt) {
      return res.status(410).json({ message: "File has expired" });
    }

    // Enforce retention limits for free users (30 days)
    if (req.user.plan !== 'pro') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (file.createdAt < thirtyDaysAgo) {
        return res.status(410).json({ message: "File has expired due to retention policy. Upgrade to Pro for unlimited retention." });
      }
    }

    // check maxDownloads
    if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
      return res.status(410).json({ message: "Download limit reached" });
    }

    if (file.passwordHash && !isFolderOwner) {
      if (!password) return res.status(400).json({ message: "Password required" });
      const isMatch = await bcrypt.compare(password, file.passwordHash);
      if (!isMatch) {
        file.failedAttempts += 1;
        await file.save();
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    // Track view
    file.viewCount += 1;
    file.viewTimestamps.push(new Date());
    await file.save();

    const hasViewerPermission = await checkPermission(req.user._id, file._id, 'file', 'viewer');
    const hasDownloadPermission = await checkPermission(req.user._id, file._id, 'file', 'downloader');

    let viewUrl = null;
    let downloadUrl = null;

    if (hasViewerPermission) {
      viewUrl = `/files/${file._id}/view`;
    }

    if (hasDownloadPermission) {
      downloadUrl = `/files/${file._id}/download`;
    }

    res.json({ viewUrl, downloadUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// View file inline
export const viewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (file.blocked) return res.status(403).json({ message: "File is blocked" });

    // Check permissions - viewers and above can view
    const hasPermission = await checkPermission(req.user._id, file._id, 'file', 'viewer');
    if (!hasPermission) return res.status(403).json({ message: "View denied" });

    // Track view
    file.viewCount += 1;
    file.viewTimestamps.push(new Date());
    await file.save();

    // Set headers for inline display
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', 'inline; filename="' + file.originalName + '"');
    res.sendFile(path.resolve(file.path));
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

    // Check permissions - downloaders and above can download
    const hasPermission = await checkPermission(req.user._id, file._id, 'file', 'downloader');
    if (!hasPermission) return res.status(403).json({ message: "Download denied" });

    // Increment download count and track timestamp
    file.downloadCount += 1;
    file.downloadTimestamps.push(new Date());
    await file.save();

    // Set correct Content-Type
    res.setHeader('Content-Type', file.mimeType);
    res.download(path.resolve(file.path), file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete file (owner or editor)
export const deleteFile = async (req, res) => {
  try {
    console.log('Delete file request:', { userId: req.user._id, fileId: req.params.id });
    const file = await File.findById(req.params.id);
    if (!file) {
      console.log('File not found');
      return res.status(404).json({ message: "File not found" });
    }
    console.log('File found:', { ownerId: file.ownerId, ownerIdType: typeof file.ownerId, userId: req.user._id, userIdType: typeof req.user._id });

    // Check if user is owner
    if (!file.ownerId.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Delete file from filesystem
    try {
      if (fs.existsSync(path.resolve(file.path))) {
        fs.unlinkSync(path.resolve(file.path));
      } else {
        console.warn('File not found on filesystem, skipping unlink:', file.path);
      }
    } catch (unlinkError) {
      console.warn('Warning: Could not delete file from filesystem:', unlinkError.message);
      // Continue to delete from DB even if file deletion fails
    }
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: error.message });
  }
};

//set expiry
export const setExpiry = async (req, res) => {
  try {
    const { expiresAt, maxDownloads } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    if (expiresAt) file.expiresAt = new Date(expiresAt);
    if (maxDownloads) file.maxDownloads = maxDownloads;

    await file.save();
    res.json({ message: "Expiry updated successfully", file });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//reset password

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      file.passwordHash = await bcrypt.hash(newPassword, salt);
    } else {
      file.passwordHash = null; // remove password
    }

    await file.save();
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get files by folder
export const getFilesByFolder = async (req, res) => {
  try {
    const { folderId } = req.query;
    if (!folderId) return res.status(400).json({ message: "Folder ID required" });

    // Check if user has permission to view the folder
    const hasPermission = await checkPermission(req.user._id, folderId, 'folder', 'viewer');
    if (!hasPermission) return res.status(403).json({ message: "Access denied" });

    const files = await File.find({ folderId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get storage stats for user
export const getStorageStats = async (req, res) => {
  try {
    const stats = await File.aggregate([
      { $match: { ownerId: req.user._id } },
      {
        $group: {
          _id: null,
          totalSize: { $sum: "$size" },
          filesCount: { $sum: 1 }
        }
      }
    ]);

    const used = stats.length > 0 ? stats[0].totalSize : 0;
    const filesCount = stats.length > 0 ? stats[0].filesCount : 0;

    // Dynamic storage limits based on plan
    const total = req.user.plan === 'pro' ? 268435456000 : 5368709120; // 250GB for pro, 5GB for free

    const percentage = total > 0 ? ((used / total) * 100).toFixed(2) : 0;

    res.json({ used, total, filesCount, percentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//filestats
export const getFileStats = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    res.json({
      originalName: file.originalName,
      downloadCount: file.downloadCount,
      viewCount: file.viewCount,
      downloadTimestamps: file.downloadTimestamps,
      viewTimestamps: file.viewTimestamps,
      failedAttempts: file.failedAttempts,
      maxDownloads: file.maxDownloads,
      expiresAt: file.expiresAt,
      createdAt: file.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update file (create new version)
export const updateFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const { password, expiresAt } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    // Move current to versions
    file.versions.push({
      version: file.currentVersion,
      storageName: file.storageName,
      path: file.path,
      size: file.size,
      mimeType: file.mimeType,
      createdAt: file.updatedAt || file.createdAt
    });

    // Update to new version
    file.currentVersion += 1;
    file.storageName = req.file.filename;
    file.path = req.file.path;
    file.size = req.file.size;
    file.mimeType = req.file.mimetype;

    // Update password if provided
    if (password !== undefined) {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        file.passwordHash = await bcrypt.hash(password, salt);
      } else {
        file.passwordHash = null;
      }
    }

    if (expiresAt !== undefined) {
      file.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await file.save();

    res.status(200).json({
      message: "File updated successfully",
      fileId: file._id,
      version: file.currentVersion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Get file versions
export const getVersions = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const versions = [
      ...file.versions,
      {
        version: file.currentVersion,
        storageName: file.storageName,
        path: file.path,
        size: file.size,
        mimeType: file.mimeType,
        createdAt: file.updatedAt || file.createdAt
      }
    ].sort((a, b) => b.version - a.version);

    res.json(versions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Restore to a specific version
export const restoreVersion = async (req, res) => {
  try {
    const { version } = req.params;
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    if (!file.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const targetVersion = parseInt(version);
    if (targetVersion === file.currentVersion) return res.status(400).json({ message: "Already at this version" });

    let versionData;
    if (targetVersion < file.currentVersion) {
      versionData = file.versions.find(v => v.version === targetVersion);
      if (!versionData) return res.status(404).json({ message: "Version not found" });
    } else {
      return res.status(400).json({ message: "Invalid version" });
    }

    // Copy the version file to current path
    const currentPath = path.resolve(file.path);
    const versionPath = path.resolve(versionData.path);
    fs.copyFileSync(versionPath, currentPath);

    // Update file metadata to match the version
    file.storageName = versionData.storageName;
    file.size = versionData.size;
    file.mimeType = versionData.mimeType;
    file.currentVersion = targetVersion;

    // Remove versions newer than this (optional, or keep history)
    file.versions = file.versions.filter(v => v.version < targetVersion);

    await file.save();

    res.json({ message: "Version restored successfully", currentVersion: file.currentVersion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get folder analytics
export const getFolderAnalytics = async (req, res) => {
  try {
    const { folderId } = req.params;
    if (!folderId) return res.status(400).json({ message: "Folder ID required" });

    const files = await File.find({ ownerId: req.user._id, folderId });

    const analytics = {
      totalFiles: files.length,
      totalViews: files.reduce((sum, file) => sum + file.viewCount, 0),
      totalDownloads: files.reduce((sum, file) => sum + file.downloadCount, 0),
      files: files.map(file => ({
        _id: file._id,
        originalName: file.originalName,
        viewCount: file.viewCount,
        downloadCount: file.downloadCount,
        viewTimestamps: file.viewTimestamps,
        downloadTimestamps: file.downloadTimestamps,
        createdAt: file.createdAt
      }))
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

