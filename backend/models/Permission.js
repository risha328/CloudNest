import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // can be folder or file
  resourceType: { type: String, enum: ['folder', 'file'], required: true },
  role: { type: String, enum: ['viewer', 'downloader', 'uploader', 'editor'], required: true },
  grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  grantedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Permission", permissionSchema);
