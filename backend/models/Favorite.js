import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user can only favorite a folder once
favoriteSchema.index({ userId: 1, folderId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
