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

// Get dashboard analytics data
export const getDashboardAnalytics = async (req, res) => {
  try {
    // File type distribution
    const fileTypeStats = await File.aggregate([
      {
        $group: {
          _id: '$mimeType',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      {
        $project: {
          _id: 0,
          mimeType: '$_id',
          count: 1,
          totalSize: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Categorize file types
    const fileTypeCategories = {
      'Documents': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf'],
      'Images': ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'],
      'Videos': ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'],
      'Audio': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/aac'],
      'Other': []
    };

    const categorizedData = {};
    fileTypeStats.forEach(item => {
      let category = 'Other';
      for (const [cat, types] of Object.entries(fileTypeCategories)) {
        if (types.includes(item.mimeType)) {
          category = cat;
          break;
        }
      }

      if (!categorizedData[category]) {
        categorizedData[category] = { count: 0, totalSize: 0 };
      }
      categorizedData[category].count += item.count;
      categorizedData[category].totalSize += item.totalSize;
    });

    const fileTypeData = Object.entries(categorizedData).map(([name, data]) => ({
      name,
      value: data.count,
      totalSize: data.totalSize
    }));

    // User activity status (based on last login or activity)
    // For now, we'll consider users who have logged in within the last 30 days as active
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await User.countDocuments({
      role: 'user',
      lastLogin: { $gte: thirtyDaysAgo }
    });

    const inactiveUsers = await User.countDocuments({
      role: 'user',
      $or: [
        { lastLogin: { $lt: thirtyDaysAgo } },
        { lastLogin: { $exists: false } }
      ]
    });

    const totalUsers = activeUsers + inactiveUsers;
    const userActivityData = [
      {
        name: 'Active Users',
        value: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
      },
      {
        name: 'Inactive Users',
        value: totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0
      }
    ];

    res.json({
      fileTypeData,
      userActivityData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin settings
export const getAdminSettings = async (req, res) => {
  try {
    // For now, we'll return default settings. In a real app, these would be stored in a database
    const settings = {
      system: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedFileTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*', 'text/*'],
        maintenanceMode: false,
        maintenanceMessage: 'System is under maintenance. Please try again later.'
      },
      security: {
        maxLoginAttempts: 5,
        lockoutDuration: 15, // minutes
        sessionTimeout: 60, // minutes
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true
      },
      userManagement: {
        allowRegistration: true,
        requireEmailVerification: true,
        defaultUserRole: 'user',
        maxUsersPerAccount: 1
      },
      storage: {
        maxStoragePerUser: 1024 * 1024 * 1024, // 1GB
        cleanupOldFiles: true,
        cleanupAfterDays: 90,
        compressionEnabled: true
      },
      notifications: {
        emailEnabled: true,
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@cloudnest.com'
      }
    };

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin settings
export const updateAdminSettings = async (req, res) => {
  try {
    const { category, settings } = req.body;

    // Validate input
    if (!category || !settings) {
      return res.status(400).json({ message: 'Category and settings are required' });
    }

    // In a real application, you would save these to a database
    // For now, we'll just return success
    console.log(`Updating ${category} settings:`, settings);

    res.json({
      message: `${category} settings updated successfully`,
      updatedSettings: settings
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
