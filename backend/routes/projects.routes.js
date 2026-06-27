import express from "express";
import Project from "../models/Project.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured) filter.featured = featured === "true";
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(projects);
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ error: "That project doesn't exist." });
  res.json(project);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ error: "That project doesn't exist anymore." });
  res.json(project);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ error: "That project doesn't exist anymore." });
  res.json({ deleted: true });
}));

export default router;
