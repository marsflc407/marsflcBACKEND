import express from "express";
import {
  getAllSisterConcerns,
  createSisterConcern,
  updateSisterConcern,
  deleteSisterConcern,
} from "../controllers/sisterConcernController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllSisterConcerns);
router.post("/", protect, admin, createSisterConcern);
router.put("/:id", protect, admin, updateSisterConcern);
router.delete("/:id", protect, admin, deleteSisterConcern);

export default router;
