import SisterConcern from "../models/SisterConcern.js";

export const getAllSisterConcerns = async (req, res) => {
  try {
    const sisterConcerns = await SisterConcern.find({ isActive: true }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      data: sisterConcerns,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSisterConcern = async (req, res) => {
  try {
    const sisterConcern = await SisterConcern.create(req.body);

    return res.status(201).json({
      success: true,
      data: sisterConcern,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSisterConcern = async (req, res) => {
  try {
    const sisterConcern = await SisterConcern.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      data: sisterConcern,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSisterConcern = async (req, res) => {
  try {
    const sisterConcern = await SisterConcern.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: sisterConcern,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
