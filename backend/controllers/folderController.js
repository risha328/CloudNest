import Folder from "../models/Folder.js";
import File from "../models/File.js";
import Permission from "../models/Permission.js";
import Favorite from "../models/Favorite.js";
import { checkPermission } from "./permissionController.js";
import fs from "fs";
import path from "path";

// Create a new folder
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Folder name is required" });

    // Check folder count limits for free users
    if (req.user.plan === 'free') {
      const folderCount = await Folder.countDocuments({ ownerId: req.user._id });
      if (folderCount >= 5) {
        return res.status(400).json({
          message: "Free plan allows only 5 folders. Please upgrade to Pro for unlimited folders."
        });
      }
    }

    const folder = new Folder({
      ownerId: req.user._id,
      name
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all folders for the user with file counts
export const getFolders = async (req, res) => {
  try {
    // Get folders owned by user
    const ownedFolders = await Folder.find({ ownerId: req.user._id });

    // Get folders where user has permission
    const permissions = await Permission.find({
      userId: req.user._id,
      resourceType: 'folder'
    });

    const folderIds = permissions.map(p => p.resourceId);
    const permittedFolders = await Folder.find({ _id: { $in: folderIds } });

    // Combine and remove duplicates
    const allFolders = [...ownedFolders, ...permittedFolders];
    const uniqueFolders = allFolders.filter((folder, index, self) =>
      index === self.findIndex(f => f._id.equals(folder._id))
    );

    // Get favorites for the user
    const userFavorites = await Favorite.find({ userId: req.user._id }).select('folderId');
    const favoriteFolderIds = new Set(userFavorites.map(f => f.folderId.toString()));

    // Get file counts for each folder
    const foldersWithCounts = await Promise.all(uniqueFolders.map(async (folder) => {
      const fileCount = await File.countDocuments({ folderId: folder._id });
      const isFavorite = favoriteFolderIds.has(folder._id.toString());
      return {
        ...folder.toObject(),
        fileCount,
        isFavorite
      };
    }));

    res.json(foldersWithCounts.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    console.error("Error in getFolders:", error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Delete a folder (owner only)
export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    if (!folder.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    // Find all files in the folder
    const files = await File.find({ folderId: folder._id });

    // Delete files from filesystem and database
    for (const file of files) {
      try {
        fs.unlinkSync(path.resolve(file.path));
      } catch (err) {
        console.error(`Failed to delete file ${file.path}:`, err);
      }
      await file.remove();
    }

    // Delete permissions for the folder
    await Permission.deleteMany({ resourceId: folder._id, resourceType: 'folder' });

    // Delete the folder
    await folder.remove();

    res.json({ message: "Folder and all its contents deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle favorite status for a folder
export const toggleFavorite = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user._id;

    // Check if folder exists and user has access
    const folder = await Folder.findById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    // Check if user owns the folder or has permission
    const hasAccess = folder.ownerId.equals(userId) ||
      await Permission.findOne({ userId, resourceId: folderId, resourceType: 'folder' });
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, folderId });

    if (existingFavorite) {
      // Remove favorite
      await Favorite.deleteOne({ _id: existingFavorite._id });
      res.json({ message: "Folder unfavorited", isFavorite: false });
    } else {
      // Add favorite
      const favorite = new Favorite({ userId, folderId });
      await favorite.save();
      res.json({ message: "Folder favorited", isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's favorite folders
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate('folderId');
    const favoriteFolders = favorites.map(fav => fav.folderId).filter(folder => folder); // Filter out null if folder deleted

    // Add file counts
    const foldersWithCounts = await Promise.all(favoriteFolders.map(async (folder) => {
      const fileCount = await File.countDocuments({ folderId: folder._id });
      return {
        ...folder.toObject(),
        fileCount,
        isFavorite: true
      };
    }));

    res.json(foldersWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
