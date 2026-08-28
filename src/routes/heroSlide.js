import express from "express";
import {
  createHeroSlide,
  deleteHeroSlide,
  getHeroSlides,
  updateHeroSlide,
} from "../controllers/heroSlideController.js";
import { admin, protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getHeroSlides);
router.post("/", protect, admin, upload.single("image"), createHeroSlide);
router.put("/:id", protect, admin, upload.single("image"), updateHeroSlide);
router.delete("/:id", protect, admin, deleteHeroSlide);

export default router;
