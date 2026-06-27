import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    fileKey: { type: String, required: true },
    version: { type: Number, default: 1 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
