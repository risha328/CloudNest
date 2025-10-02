import Folder from "../models/Folder.js";
import File from "../models/File.js";

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
    const folders = await Folder.aggregate([
      { $match: { ownerId: req.user._id } },
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "folderId",
          as: "files"
        }
      },
      {
        $addFields: {
          fileCount: { $size: "$files" }
        }
      },
      {
        $project: {
          files: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
