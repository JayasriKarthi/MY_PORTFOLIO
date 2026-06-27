import express from "express";
import Journey from "../models/Journey.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  let journey = await Journey.findOne();
  if (!journey) journey = await Journey.create({});
  res.json(journey);
}));

router.put("/", requireAdmin, asyncHandler(async (req, res) => {
  let journey = await Journey.findOne();
  if (!journey) journey = new Journey();
  Object.assign(journey, req.body);
  await journey.save();
  res.json(journey);
}));

export default router;
