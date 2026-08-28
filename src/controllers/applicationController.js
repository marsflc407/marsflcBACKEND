import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";

export const createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);

    return res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadApplicationCv = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application?.cv) {
      return res.status(404).json({ success: false, message: "CV not found" });
    }

    let publicId = application.cvPublicId;
    let extension = application.cvFormat;
    let fileName = application.cvOriginalName || "cv";

    if (!publicId) {
      const cvUrl = new URL(application.cv);
      const marker = "/raw/upload/";
      const markerIndex = cvUrl.pathname.indexOf(marker);
      if (markerIndex === -1) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid CV URL" });
      }

      const assetPath = cvUrl.pathname.slice(markerIndex + marker.length);
      const pathParts = assetPath.split("/");
      if (/^v\d+$/.test(pathParts[0])) pathParts.shift();
      const publicIdWithExtension = decodeURIComponent(pathParts.join("/"));
      const extensionIndex = publicIdWithExtension.lastIndexOf(".");
      publicId =
        extensionIndex > -1
          ? publicIdWithExtension.slice(0, extensionIndex)
          : publicIdWithExtension;
      extension =
        extensionIndex > -1
          ? publicIdWithExtension.slice(extensionIndex + 1)
          : undefined;
      fileName = pathParts.at(-1) || fileName;
    }

    if (!extension) {
      const storedExtensionIndex = publicId.lastIndexOf(".");
      if (storedExtensionIndex > -1) {
        extension = publicId.slice(storedExtensionIndex + 1);
        publicId = publicId.slice(0, storedExtensionIndex);
      }
    }
    const signedUrl = cloudinary.utils.private_download_url(
      publicId,
      extension,
      {
        resource_type: "raw",
        type: "upload",
        attachment: true,
      },
    );
    const response = await fetch(signedUrl);
    if (!response.ok) {
      return res.status(404).json({
        success: false,
        message:
          "This CV is no longer available in Cloudinary. Please ask the applicant to submit it again.",
      });
    }

    const file = Buffer.from(await response.arrayBuffer());
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
    );
    return res.send(file);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    let publicId = application.cvPublicId;
    if (!publicId && application.cv) {
      const cvUrl = new URL(application.cv);
      const marker = "/raw/upload/";
      const markerIndex = cvUrl.pathname.indexOf(marker);

      if (markerIndex !== -1) {
        const assetPath = cvUrl.pathname.slice(markerIndex + marker.length);
        const pathParts = assetPath.split("/");
        if (/^v\d+$/.test(pathParts[0])) pathParts.shift();
        publicId = decodeURIComponent(pathParts.join("/"));
      }
    }

    if (publicId) {
      const extensionIndex = publicId.lastIndexOf(".");
      if (extensionIndex > -1) publicId = publicId.slice(0, extensionIndex);

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
        type: "upload",
        invalidate: true,
      });
    }

    await application.deleteOne();

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
