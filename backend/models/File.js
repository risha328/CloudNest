import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  originalName: { type: String, required: true },
  storageName: { type: String, required: true },
  path: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
  passwordHash: { type: String }, // bcrypt hash
  downloadCount: { type: Number, default: 0 },
  maxDownloads: { type: Number },
  expiresAt: { type: Date },
  blocked: { type: Boolean, default: false },
   failedAttempts: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
