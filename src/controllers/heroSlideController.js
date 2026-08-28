import fs from "fs/promises";
import cloudinary from "../config/cloudinary.js";
import HeroSlide from "../models/HeroSlide.js";

const removeLocalFile = async (file) => {
  if (file?.path) await fs.unlink(file.path).catch(() => {});
};

export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });
    return res.status(200).json({ success: true, data: slides });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHeroSlide = async (req, res) => {
  let uploadResult;
  try {
    const { title, description, eyebrow, order, isActive } = req.body;
    if (!req.file || !title?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and an image are required.",
      });
    }

    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc/home-hero",
    });
    await removeLocalFile(req.file);

    const slide = await HeroSlide.create({
      eyebrow: eyebrow?.trim(),
      title: title.trim(),
      description: description.trim(),
      image: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      order: Number(order) || 0,
      isActive: isActive !== "false",
    });
    return res.status(201).json({ success: true, data: slide });
  } catch (error) {
    await removeLocalFile(req.file);
    if (uploadResult?.public_id)
      await cloudinary.uploader.destroy(uploadResult.public_id).catch(() => {});
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHeroSlide = async (req, res) => {
  let uploadResult;
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide)
      return res
        .status(404)
        .json({ success: false, message: "Hero slide not found." });

    const { title, description, eyebrow, order, isActive } = req.body;
    if (title !== undefined) slide.title = title.trim();
    if (description !== undefined) slide.description = description.trim();
    if (eyebrow !== undefined) slide.eyebrow = eyebrow.trim();
    if (order !== undefined) slide.order = Number(order) || 0;
    if (isActive !== undefined) slide.isActive = isActive !== "false";

    if (req.file) {
      uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "mars-flc/home-hero",
      });
      await removeLocalFile(req.file);
      await cloudinary.uploader.destroy(slide.publicId);
      slide.image = uploadResult.secure_url;
      slide.publicId = uploadResult.public_id;
    }

    await slide.save();
    return res.status(200).json({ success: true, data: slide });
  } catch (error) {
    await removeLocalFile(req.file);
    if (uploadResult?.public_id)
      await cloudinary.uploader.destroy(uploadResult.public_id).catch(() => {});
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide)
      return res
        .status(404)
        .json({ success: false, message: "Hero slide not found." });
    await cloudinary.uploader.destroy(slide.publicId);
    await slide.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Hero slide deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
