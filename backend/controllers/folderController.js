import Folder from "../models/Folder.js";
import File from "../models/File.js";
import Permission from "../models/Permission.js";
import { checkPermission } from "./permissionController.js";
import fs from "fs";
import path from "path";

// Create a new folder
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Folder name is required" });

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

    // Get file counts for each folder
    const foldersWithCounts = await Promise.all(uniqueFolders.map(async (folder) => {
      const fileCount = await File.countDocuments({ folderId: folder._id });
      return {
        ...folder.toObject(),
        fileCount
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
