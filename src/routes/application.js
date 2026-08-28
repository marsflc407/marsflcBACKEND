import express from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  downloadApplicationCv,
} from "../controllers/applicationController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createApplication);
router.get("/", protect, admin, getApplications);
router.get("/:id", protect, admin, getApplicationById);
router.get("/:id/cv", protect, admin, downloadApplicationCv);
router.put("/:id/status", protect, admin, updateApplicationStatus);
router.delete("/:id", protect, admin, deleteApplication);

export default router;
