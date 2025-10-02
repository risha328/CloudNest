import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Folder", folderSchema);
