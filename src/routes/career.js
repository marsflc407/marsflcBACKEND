import express from "express";
import {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCareers);
router.post("/", protect, admin, createCareer);
router.put("/:id", protect, admin, updateCareer);
router.delete("/:id", protect, admin, deleteCareer);

export default router;
