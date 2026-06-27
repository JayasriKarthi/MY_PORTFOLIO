import express from "express";
import Certificate from "../models/Certificate.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadToS3, deleteFromS3, s3KeyFromUrl } from "../config/s3.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const certs = await Certificate.find().sort({ order: 1 });
  res.json(certs);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const cert = await Certificate.create(req.body);
  res.status(201).json(cert);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cert) return res.status(404).json({ error: "That certificate doesn't exist anymore." });
  res.json(cert);
}));

router.post("/:id/badge", requireAdmin, upload.single("badge"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Attach an image file." });
  const cert = await Certificate.findById(req.params.id);
  if (!cert) return res.status(404).json({ error: "That certificate doesn't exist anymore." });

  const key = `certificates/${cert._id}-${Date.now()}-${req.file.originalname}`;
  const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);

  cert.badgeImageUrl = url;
  await cert.save();
  res.json(cert);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const cert = await Certificate.findByIdAndDelete(req.params.id);
  if (!cert) return res.status(404).json({ error: "That certificate doesn't exist anymore." });
  if (cert.badgeImageUrl) {
    const key = s3KeyFromUrl(cert.badgeImageUrl);
    if (key) await deleteFromS3(key).catch(() => {});
  }
  res.json({ deleted: true });
}));

export default router;
