import express from "express";
import {
  getAllNewsfeeds,
  getAllNewsfeedsAdmin,
  getNewsfeedById,
  createNewsfeed,
  updateNewsfeed,
  deleteNewsfeed,
} from "../controllers/newsfeedController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllNewsfeeds);
router.get("/admin/all", protect, admin, getAllNewsfeedsAdmin);
router.get("/:id", getNewsfeedById);
router.post("/", protect, admin, createNewsfeed);
router.put("/:id", protect, admin, updateNewsfeed);
router.delete("/:id", protect, admin, deleteNewsfeed);

export default router;
