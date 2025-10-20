import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  // Fair use policy fields
  bandwidthUsed: { type: Number, default: 0 }, // Bytes used this month
  bandwidthResetDate: { type: Date, default: Date.now }, // When bandwidth was last reset
  lastActivity: { type: Date, default: Date.now }, // Last API activity
  rateLimitHits: { type: Number, default: 0 }, // Number of rate limit hits
  warningsSent: [{ type: Date }] // Array of warning timestamps
}, { timestamps: true });

export default mongoose.model("User", userSchema);
