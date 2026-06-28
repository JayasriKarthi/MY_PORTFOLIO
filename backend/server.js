import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/auth.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import certificatesRoutes from "./routes/certificates.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import journeyRoutes from "./routes/journey.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import visitsRoutes from "./routes/visits.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
  })
);
app.use(express.json());


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});
app.use("/api/auth/login", authLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/visits", visitsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "That route doesn't exist." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong on our end." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
});
