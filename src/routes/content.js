import express from "express";
import {
  getContentByPage,
  getAllContentByPage,
  getContentBySection,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/:page", protect, admin, getAllContentByPage);
router.get("/:page", getContentByPage);
router.get("/:page/:section", getContentBySection);
router.post("/", protect, admin, createContent);
router.put("/:id", protect, admin, updateContent);
router.delete("/:id", protect, admin, deleteContent);

export default router;
