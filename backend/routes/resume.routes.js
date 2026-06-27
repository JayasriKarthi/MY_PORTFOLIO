import express from "express";
import Resume from "../models/Resume.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadToS3 } from "../config/s3.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const latest = await Resume.findOne().sort({ version: -1 });
  res.json(latest || null);
}));

router.get("/history", requireAdmin, asyncHandler(async (req, res) => {
  const all = await Resume.find().sort({ version: -1 });
  res.json(all);
}));

router.post("/", requireAdmin, upload.single("resume"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Attach a PDF file." });

  const latest = await Resume.findOne().sort({ version: -1 });
  const nextVersion = latest ? latest.version + 1 : 1;

  const key = `resumes/v${nextVersion}-${Date.now()}-${req.file.originalname}`;
  const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);

  const resume = await Resume.create({
    fileUrl: url,
    fileKey: key,
    version: nextVersion,
  });

  res.status(201).json(resume);
}));

export default router;
