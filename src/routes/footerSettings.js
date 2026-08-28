import express from "express";
import {
  getFooterSettings,
  updateFooterSettings,
} from "../controllers/footerSettingsController.js";
import { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getFooterSettings);
router.put("/", protect, admin, updateFooterSettings);

export default router;
