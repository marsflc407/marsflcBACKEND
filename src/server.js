import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import serviceRoutes from "./routes/services.js";
import uploadRoutes from "./routes/upload.js";
import sisterConcernRoutes from "./routes/sisterConcern.js";
import contactRoutes from "./routes/contact.js";
import careerRoutes from "./routes/career.js";
import applicationRoutes from "./routes/application.js";
import partnerCompanyRoutes from "./routes/partnerCompany.js";
import heroSlideRoutes from "./routes/heroSlide.js";
import contactSettingsRoutes from "./routes/contactSettings.js";
import contactMessageRoutes from "./routes/contactMessage.js";
import footerSettingsRoutes from "./routes/footerSettings.js";
import debtCollectionSettingsRoutes from "./routes/debtCollectionSettings.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

dotenv.config({ path: path.resolve(currentDirectory, "../.env") });
connectDB();

const app = express();

const allowedOrigins = [
  "https://marsflc.vercel.app",
  "http://localhost:5173",
  process.env.CLIENT_URLS,
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .join(",")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/sister-concern", sisterConcernRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/partner-companies", partnerCompanyRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/contact-settings", contactSettingsRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/footer-settings", footerSettingsRoutes);
app.use("/api/debt-collection-settings", debtCollectionSettingsRoutes);

app.get("/api", (req, res) => {
  res.send("API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
