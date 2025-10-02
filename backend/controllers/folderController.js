import Folder from "../models/Folder.js";
import File from "../models/File.js";
import Permission from "../models/Permission.js";
import { checkPermission } from "./permissionController.js";

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
    }).populate('resourceId');

    const permittedFolders = permissions.map(p => p.resourceId);

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
    res.status(500).json({ message: error.message });
  }
};
