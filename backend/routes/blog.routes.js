import express from "express";
import Blog from "../models/Blog.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const onlyPublished = !req.query.all;
  const filter = onlyPublished ? { published: true } : {};
  const posts = await Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  res.json(posts);
}));

router.get("/:slug", asyncHandler(async (req, res) => {
  const post = await Blog.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ error: "That post doesn't exist." });
  res.json(post);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.published) data.publishedAt = new Date();
  const post = await Blog.create(data);
  res.status(201).json(post);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (data.published) data.publishedAt = data.publishedAt || new Date();
  const post = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!post) return res.status(404).json({ error: "That post doesn't exist anymore." });
  res.json(post);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const post = await Blog.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ error: "That post doesn't exist anymore." });
  res.json({ deleted: true });
}));

export default router;
