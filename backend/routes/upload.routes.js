import express from "express";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadToS3 } from "../config/s3.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/projects/:id/architecture", requireAdmin, upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Attach an image file." });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "That project doesn't exist." });

  const key = `projects/${project._id}/architecture-${Date.now()}-${req.file.originalname}`;
  const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);

  project.architectureImageUrl = url;
  await project.save();
  res.json(project);
}));

router.post("/projects/:id/screenshots", requireAdmin, upload.array("images", 8), asyncHandler(async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: "Attach at least one image." });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "That project doesn't exist." });

  const urls = [];
  for (const file of req.files) {
    const key = `projects/${project._id}/screenshot-${Date.now()}-${file.originalname}`;
    const url = await uploadToS3(file.buffer, key, file.mimetype);
    urls.push(url);
  }

  project.screenshotUrls.push(...urls);
  await project.save();
  res.json(project);
}));

export default router;
