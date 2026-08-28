import express from "express";
import {
  getCareers,
  getAllCareers,
  createCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCareers);
router.get("/admin/all", protect, admin, getAllCareers);
router.post("/", protect, admin, createCareer);
router.put("/:id", protect, admin, updateCareer);
router.delete("/:id", protect, admin, deleteCareer);

export default router;
