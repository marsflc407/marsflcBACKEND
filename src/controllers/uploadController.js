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
    const description = req.body.description || "";
    const category = req.body.category || "other";
    const alt = req.body.alt || "";

    if (section === "gallery" || category === "gallery") {
      return res.status(400).json({
        success: false,
        message: "Use the dedicated Gallery upload route.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc",
    });

    const image = await Image.create({
      title,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      section,
      alt,
      description,
      category,
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
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
  }
};

export const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc/gallery",
    });

    const image = await Image.create({
      title: req.body.title || "",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      section: "gallery",
      category: "gallery",
      alt: req.body.alt || "",
      description: req.body.description || "",
    });

    return res.status(201).json({ success: true, data: image });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
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

    if (section === "gallery" || req.body.category === "gallery") {
      return res.status(400).json({
        success: false,
        message: "Use the dedicated Gallery upload route.",
      });
    }

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
          category: "other",
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

export const deleteGalleryImages = async (req, res) => {
  try {
    const images = await Image.find({
      category: "gallery",
      section: "gallery",
    });

    await Promise.all(
      images.map((image) => cloudinary.uploader.destroy(image.publicId)),
    );
    const result = await Image.deleteMany({
      category: "gallery",
      section: "gallery",
    });

    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const replaceImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc",
    });
    await cloudinary.uploader.destroy(image.publicId);
    image.url = uploadResult.secure_url;
    image.publicId = uploadResult.public_id;
    image.title = req.body.title ?? image.title;
    image.alt = req.body.alt ?? image.alt;
    image.description = req.body.description ?? image.description;
    image.category = req.body.category || image.category;
    image.section = req.body.section || image.section;
    await image.save();

    return res.status(200).json({ success: true, data: image });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (req.file) fs.unlink(req.file.path, () => {});
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

export const getAdminImages = async (req, res) => {
  try {
    const images = await Image.find({
      category: "gallery",
      section: "gallery",
    }).sort({ order: 1 });

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

export const updateImageVisibility = async (req, res) => {
  try {
    const image = await Image.findOneAndUpdate(
      { _id: req.params.id, section: "gallery" },
      { isActive: Boolean(req.body.isActive) },
      { new: true, runValidators: true },
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    return res.status(200).json({ success: true, data: image });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGalleryImages = async (req, res) => {
  try {
    const images = await Image.find({
      category: "gallery",
      section: "gallery",
      isActive: true,
    })
      .sort({ order: 1 })
      .limit(20);

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
