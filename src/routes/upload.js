import express from "express";
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getImages,
} from "../controllers/uploadController.js";
import { protect, admin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/single", protect, admin, upload.single("image"), uploadImage);
router.post(
  "/multiple",
  protect,
  admin,
  upload.array("images", 5),
  uploadMultipleImages,
);
router.delete("/:id", protect, admin, deleteImage);
router.get("/", getImages);

export default router;
