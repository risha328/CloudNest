import Permission from "../models/Permission.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import mongoose from "mongoose";
import User from "../models/User.js";

// Grant permission to a user for a resource
export const grantPermission = async (req, res) => {
  try {
    const { userId, resourceId, resourceType, role } = req.body;

    // Validate inputs
    if (!userId || !resourceId || !resourceType || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if resource exists and user is owner
    let resource;
    if (resourceType === 'folder') {
      resource = await Folder.findById(resourceId);
    } else if (resourceType === 'file') {
      resource = await File.findById(resourceId);
    } else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (!resource.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    // Check if permission already exists
    const existingPermission = await Permission.findOne({
      userId,
      resourceId,
      resourceType
    });

    if (existingPermission) {
      existingPermission.role = role;
      await existingPermission.save();
      return res.json({ message: "Permission updated", permission: existingPermission });
    }

    const permission = new Permission({
      userId,
      resourceId,
      resourceType,
      role,
      grantedBy: req.user._id
    });

    await permission.save();
    res.status(201).json({ message: "Permission granted", permission });
  } catch (error) {
    console.error("Error in grantPermission:", error);
    res.status(500).json({ message: error.message });
  }
};

// Revoke permission
export const revokePermission = async (req, res) => {
  try {
    const { resourceId, resourceType, userId } = req.params;

    // Check if resource exists and user is owner
    let resource;
    if (resourceType === 'folder') {
      resource = await Folder.findById(resourceId);
    } else if (resourceType === 'file') {
      resource = await File.findById(resourceId);
    } else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (!resource.ownerId.equals(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    await Permission.findOneAndDelete({
      userId,
      resourceId,
      resourceType
    });

    res.json({ message: "Permission revoked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get permissions for a resource
export const getPermissions = async (req, res) => {
  try {
    const { resourceId, resourceType } = req.params;

    // Check if resource exists
    let resource;
    if (resourceType === 'folder') {
      resource = await Folder.findById(resourceId);
    } else if (resourceType === 'file') {
      resource = await File.findById(resourceId);
    } else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    if (!resource) return res.status(404).json({ message: "Resource not found" });

    // Check if user is owner or has permission
    if (!resource.ownerId.equals(req.user._id)) {
      const hasPermission = await checkPermission(req.user._id, resourceId, resourceType, 'viewer');
      if (!hasPermission) return res.status(403).json({ message: "Forbidden" });
    }

    const permissions = await Permission.find({
      resourceId,
      resourceType
    }).populate('userId', 'name email').populate('grantedBy', 'name email');

    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to check permission
export const checkPermission = async (userId, resourceId, resourceType, requiredRole) => {
  // Owner always has full access
  let resource;
  if (resourceType === 'folder') {
    resource = await Folder.findById(resourceId);
  } else if (resourceType === 'file') {
    resource = await File.findById(resourceId);
  }

  if (resource && resource.ownerId.equals(userId)) return true;

  // For files, also check if user owns the containing folder
  if (resourceType === 'file' && resource && resource.folderId) {
    const folder = await Folder.findById(resource.folderId);
    if (folder && folder.ownerId.equals(userId)) return true;
  }

  const permission = await Permission.findOne({
    userId,
    resourceId,
    resourceType
  });

  if (!permission) return false;

  const roles = ['viewer', 'downloader', 'uploader', 'editor'];
  const userRoleIndex = roles.indexOf(permission.role);
  const requiredRoleIndex = roles.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
};
