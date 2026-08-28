import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();
connectDB();

const app = express();

app.use(cors());
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

app.get("/api", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
