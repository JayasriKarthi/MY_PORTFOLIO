import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    summary: { type: String, required: true },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    challenges: { type: String, default: "" },
    lessonsLearned: { type: String, default: "" },
    futureImprovements: { type: String, default: "" },
    status: { type: String, enum: ["completed", "in_progress", "planned"], default: "planned" },
    difficulty: { type: Number, min: 1, max: 5, default: 3 },
    category: { type: String, enum: ["cloud", "ai", "android", "devops", "networking"], default: "cloud" },
    awsServices: [{ type: String }],
    flow: [{ type: String }],
    architectureImageUrl: { type: String, default: "" },
    screenshotUrls: [{ type: String }],
    githubUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    docsUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
