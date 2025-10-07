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

// Get analytics data
export const getAnalyticsData = async (req, res) => {
  try {
    const range = req.query.range || '30d';
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // File Upload Trends: uploads per day
    const uploadTrends = await File.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Download Trends: downloads per day (assuming downloadCount is cumulative, we need to track daily downloads)
    // For simplicity, we'll use createdAt as proxy, but ideally you'd have a downloads collection
    const downloadTrends = await File.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: '$downloadCount' }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Top 10 Most Downloaded Files
    const topDownloadedFiles = await File.aggregate([
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
        $project: {
          originalName: 1,
          downloadCount: 1,
          viewCount: 1,
          size: 1,
          fileType: '$mimeType',
          ownerName: '$owner.name'
        }
      },
      {
        $sort: { downloadCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Top Users by Upload Volume (by file count)
    const topUsersByUploads = await File.aggregate([
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
          fileCount: { $sum: 1 },
          totalStorage: { $sum: '$size' },
          totalDownloads: { $sum: '$downloadCount' },
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
          fileCount: 1,
          totalStorage: 1,
          totalDownloads: 1
        }
      },
      {
        $sort: { fileCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // File Type Distribution
    const fileTypeDistribution = await File.aggregate([
      {
        $group: {
          _id: '$mimeType',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Malware Scan Summary
    const malwareSummary = await File.aggregate([
      {
        $group: {
          _id: '$blocked',
          count: { $sum: 1 }
        }
      }
    ]);

    // User Activity (daily active users approximation)
    const userActivity = await File.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          activeUsers: { $addToSet: '$ownerId' }
        }
      },
      {
        $project: {
          subject: '$_id',
          activeUsers: { $size: '$activeUsers' },
          totalUsers: { $literal: await User.countDocuments({ role: 'user' }) }
        }
      },
      {
        $sort: { subject: 1 }
      }
    ]);

    // System Health Stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFiles = await File.countDocuments();
    const totalDownloads = await File.aggregate([
      { $group: { _id: null, total: { $sum: "$downloadCount" } } }
    ]);
    const totalStorage = await File.aggregate([
      { $group: { _id: null, storage: { $sum: "$size" } } }
    ]);

    // Real-time stats (mock data for now)
    const realTimeStats = {
      activeUsers: Math.floor(totalUsers * 0.1), // 10% active
      userGrowth: 5.2,
      fileGrowth: 12.8,
      downloadGrowth: 8.3,
      storageGrowth: 15.6
    };

    // Security Stats
    const securityStats = {
      successfulScans: totalFiles,
      quarantinedFiles: malwareSummary.find(m => m._id === true)?.count || 0,
      securityAlerts: 0,
      lastScan: new Date(),
      scanSuccessRate: 100
    };

    res.json({
      uploadTrends,
      downloadTrends,
      topDownloadedFiles,
      topUsersByUploads,
      fileTypeDistribution,
      malwareSummary,
      userActivity,
      systemHealth: {
        totalUsers,
        totalFiles,
        totalDownloads: totalDownloads[0]?.total || 0,
        totalStorage: totalStorage[0]?.storage || 0
      },
      realTimeStats,
      securityStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
