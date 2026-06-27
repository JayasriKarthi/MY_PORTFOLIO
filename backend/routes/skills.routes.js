import express from "express";
import Skill from "../models/Skill.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  res.json(skills);
}));

router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
}));

router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!skill) return res.status(404).json({ error: "That skill doesn't exist anymore." });
  res.json(skill);
}));

router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return res.status(404).json({ error: "That skill doesn't exist anymore." });
  res.json({ deleted: true });
}));

export default router;
