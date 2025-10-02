import Folder from "../models/Folder.js";

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

// Get all folders for the user
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
