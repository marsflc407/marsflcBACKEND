import express from "express";
import {
  uploadImage,
  uploadGalleryImage,
  uploadMultipleImages,
  deleteImage,
  deleteGalleryImages,
  getImages,
  getAdminImages,
  getGalleryImages,
  uploadCv,
  replaceImage,
  updateImageVisibility,
} from "../controllers/uploadController.js";
import { protect, admin } from "../middleware/auth.js";
import upload, { uploadCv as uploadCvFile } from "../middleware/upload.js";

const router = express.Router();

router.post("/single", protect, admin, upload.single("image"), uploadImage);
router.post(
  "/gallery",
  protect,
  admin,
  upload.single("image"),
  uploadGalleryImage,
);
router.delete("/gallery/all", protect, admin, deleteGalleryImages);
router.post("/cv", uploadCvFile.single("cv"), uploadCv);
router.post(
  "/multiple",
  protect,
  admin,
  upload.array("images", 5),
  uploadMultipleImages,
);
router.get("/admin/all", protect, admin, getAdminImages);
router.patch("/:id/visibility", protect, admin, updateImageVisibility);
router.delete("/:id", protect, admin, deleteImage);
router.put("/:id", protect, admin, upload.single("image"), replaceImage);
router.get("/", getImages);
router.get("/gallery", getGalleryImages);

export default router;
