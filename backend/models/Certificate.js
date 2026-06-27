import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    status: { type: String, enum: ["completed", "in_progress", "not_started"], default: "not_started" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    expectedDate: { type: String, default: "" },
    notes: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
    badgeImageUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
