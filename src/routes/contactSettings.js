import express from "express";
import {
  getContactSettings,
  updateContactSettings,
} from "../controllers/contactSettingsController.js";
import { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getContactSettings);
router.put("/", protect, admin, updateContactSettings);

export default router;
