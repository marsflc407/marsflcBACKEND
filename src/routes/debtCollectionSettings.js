import express from "express";
import {
  getDebtCollectionSettings,
  updateDebtCollectionSettings,
} from "../controllers/debtCollectionSettingsController.js";
import { admin, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getDebtCollectionSettings);
router.put("/", protect, admin, updateDebtCollectionSettings);

export default router;
