import express from "express";
import Visit from "../models/Visit.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { path } = req.body;
  if (!path) return res.status(400).json({ error: "Missing path." });
  await Visit.create({
    path,
    referrer: req.get("referer") || "",
    userAgent: req.get("user-agent") || "",
  });
  res.status(201).json({ tracked: true });
}));

router.get("/summary", requireAdmin, asyncHandler(async (req, res) => {
  const total = await Visit.countDocuments();
  const last30Days = await Visit.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  });
  const byPath = await Visit.aggregate([
    { $group: { _id: "$path", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  res.json({ total, last30Days, byPath });
}));

export default router;
