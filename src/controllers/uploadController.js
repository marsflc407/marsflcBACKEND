import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import Image from "../models/Image.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const section = req.body.section || "other";
    const title = req.body.title || "";
    const alt = req.body.alt || "";

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc",
    });

    const image = await Image.create({
      title,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      section,
      alt,
    });

    return res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No CV file provided" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc/cvs",
      resource_type: "raw",
      use_filename: true,
      unique_filename: true,
    });

    return res.status(201).json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    const section = req.body.section || "other";
    const title = req.body.title || "";
    const alt = req.body.alt || "";

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "mars-flc",
        });

        return Image.create({
          title,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          section,
          alt,
        });
      }),
    );

    return res.status(201).json({
      success: true,
      data: uploadedImages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    await cloudinary.uploader.destroy(image.publicId);
    await Image.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find({ isActive: true }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
