import File from "../models/File.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate("ownerId", "name email");
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

// Platform stats
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
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
