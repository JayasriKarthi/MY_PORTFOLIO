import mongoose from "mongoose";

const journeySchema = new mongoose.Schema(
  {
    leetcodeProblems: { type: Number, default: 0 },
    githubCommits: { type: Number, default: 0 },
    hackathons: { type: Number, default: 0 },
    awsServicesLearned: { type: Number, default: 0 },
    awsServicesTotal: { type: Number, default: 25 },
    progressByArea: {
      cloud: { type: Number, default: 0 },
      devops: { type: Number, default: 0 },
      ai: { type: Number, default: 0 },
      programming: { type: Number, default: 0 },
      networking: { type: Number, default: 0 },
    },
    currentGoal: { type: String, default: "AWS Solutions Architect Associate" },
    currentGoalProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Journey", journeySchema);
