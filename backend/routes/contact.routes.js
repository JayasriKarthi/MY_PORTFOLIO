import express from "express";
import Message from "../models/Message.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Fill in your name, email, and message." });
  }
  const saved = await Message.create({ name, email, message });
  res.status(201).json({ sent: true, id: saved._id });
}));

router.get("/", requireAdmin, asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
}));

router.put("/:id/read", requireAdmin, asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!message) return res.status(404).json({ error: "That message doesn't exist." });
  res.json(message);
}));

export default router;
