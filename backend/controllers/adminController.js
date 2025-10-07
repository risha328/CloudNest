import File from "../models/File.js";
import User from "../models/User.js";
import Folder from "../models/Folder.js";
import fs from "fs";
import path from "path";

// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: { path: '$owner', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'permissions',
          let: { fileId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$fileId'] }, { $eq: ['$resourceType', 'file'] }] } } }
          ],
          as: 'permissions'
        }
      },
      {
        $addFields: {
          accessCount: { $size: '$permissions' },
          ownerName: '$owner.name',
          ownerEmail: '$owner.email'
        }
      },
      {
        $project: {
          originalName: 1,
          expiresAt: 1,
          createdAt: 1,
          viewCount: 1,
          downloadCount: 1,
          accessCount: 1,
          ownerName: 1,
          ownerEmail: 1,
          size: 1,
          mimeType: 1
        }
      }
    ]);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete file (abusive/malware)
export const adminDeleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    fs.unlinkSync(path.resolve(file.path)); // delete from server
    await file.deleteOne();

    res.json({ message: "File deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all folders
export const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: { path: '$owner', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'permissions',
          let: { folderId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$resourceId', '$$folderId'] }, { $eq: ['$resourceType', 'folder'] }] } } }
          ],
          as: 'permissions'
        }
      },
      {
        $addFields: {
          accessCount: { $size: '$permissions' },
          ownerName: '$owner.name',
          ownerEmail: '$owner.email'
        }
      },
      {
        $project: {
          name: 1,
          createdAt: 1,
          accessCount: 1,
          ownerName: 1,
          ownerEmail: 1
        }
      }
    ]);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name email role createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Platform stats
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFiles = await File.countDocuments();
    const totalDownloads = await File.aggregate([
      { $group: { _id: null, total: { $sum: "$downloadCount" } } }
    ]);

    const totalStorage = await File.aggregate([
      { $group: { _id: null, storage: { $sum: "$size" } } }
    ]);

    res.json({
      totalUsers,
      totalFiles,
      totalDownloads: totalDownloads[0]?.total || 0,
      totalStorage: totalStorage[0]?.storage || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get storage details (per user and total)
export const getStorageDetails = async (req, res) => {
  try {
    const storagePerUser = await File.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: { path: '$owner', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$ownerId',
          totalStorage: { $sum: '$size' },
          fileCount: { $sum: 1 },
          ownerName: { $first: '$owner.name' },
          ownerEmail: { $first: '$owner.email' }
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          ownerName: 1,
          ownerEmail: 1,
          totalStorage: 1,
          fileCount: 1
        }
      },
      {
        $sort: { totalStorage: -1 }
      }
    ]);

    const totalStorage = await File.aggregate([
      { $group: { _id: null, storage: { $sum: "$size" } } }
    ]);

    res.json({
      totalStorage: totalStorage[0]?.storage || 0,
      storagePerUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
