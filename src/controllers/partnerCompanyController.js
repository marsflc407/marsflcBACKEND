import cloudinary from "../config/cloudinary.js";
import PartnerCompany from "../models/PartnerCompany.js";

export const getPartnerCompanies = async (req, res) => {
  try {
    const partnerCompanies = await PartnerCompany.find({ isActive: true }).sort(
      {
        createdAt: 1,
      },
    );

    return res.status(200).json({
      success: true,
      data: partnerCompanies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPartnerCompany = async (req, res) => {
  let uploadResult;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a company image.",
      });
    }

    const name = req.body.name?.trim();
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "mars-flc/partner-companies",
    });

    const partnerCompany = await PartnerCompany.create({
      name,
      image: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    return res.status(201).json({
      success: true,
      data: partnerCompany,
    });
  } catch (error) {
    if (uploadResult?.public_id) {
      await cloudinary.uploader.destroy(uploadResult.public_id).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePartnerCompany = async (req, res) => {
  try {
    const partnerCompany = await PartnerCompany.findById(req.params.id);

    if (!partnerCompany) {
      return res.status(404).json({
        success: false,
        message: "Partner company not found.",
      });
    }

    await cloudinary.uploader.destroy(partnerCompany.publicId);
    await partnerCompany.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Partner company deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
